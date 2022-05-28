library(rvest)
library(tidyverse)
library(janitor)
library(furrr)
library(RSQLite)
library(DBI)
plan(multisession)

extract_cat <- function(url) {
  page <- read_html(url)
  
  tibble(
    category = page %>%
      html_nodes(".subcatlist") %>%
      html_text(trim = TRUE) %>%
      make_clean_names(), 
    url = page %>%
      html_nodes(".subcatlist") %>%
      html_nodes("a") %>%
      html_attr("href")
  )
}

category <- extract_cat("https://www.wandtattoo.de/sprueche")

extract_pages <- function(url, category) {
  page <- read_html(url)
  
  tibble(
    url = page %>% 
      html_nodes(".wandtattookategoriedetails") %>% 
      html_nodes(".d-block") %>% 
      html_attr("href"),
    category = category
  )
}

wndttt_pages <- map2_dfr(categories$url, categories$category, extract_pages)

extract_wandtattoo <- function(url, category) {
  page <- read_html(url)
  
  tibble(
    wndttt = tryCatch(page %>%
      rvest::html_nodes(".card-body") %>%
      .[1] %>% # get the first element (description)
      html_nodes("p") %>% .[1] %>%
      html_text2() %>% # br to new line 
      sub(".*endif]\\n\\n\\r\\n\\n", "", .) %>%
      # remove mso rules
      stringr::str_split(pattern = "(\\n\\n\\r)|(\\n\\()") %>% 
      # seperate on new break or (Breite x ...) phrase
      .[[1]] %>% ## select the element
      .[1], error = function(e) print(NA_character_)), # get everything before the first break
    category = category,
    url = url
  )

}

wndttt_data <- future_map2_dfr(wndttt_pages$url, 
                               wndttt_pages$category,
                               extract_wandtattoo,
                               .progress = TRUE)


# final cleaning (still an issue with html_text2 with printing mso data)
wndttt_data_clean <- wndttt_data %>%
  filter(!str_detect(wndttt, "[if gte mso 9]>")) %>%
  filter(!is.na(wndttt))


# write it down to sqlite
con <- dbConnect(RSQLite::SQLite(), "wndttt_data.db")

dbCreateTable(con, "wndttt", wndttt_data_clean)

dbDisconnect(con)
