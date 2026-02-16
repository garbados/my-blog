(defproject my-blog "0.1.0-SNAPSHOT"
  :description "FIXME: write description"
  :url "http://example.com/FIXME"
  :license {:name "CC BY-NC-ND 4.0"
            :url "https://creativecommons.org/licenses/by-nc-nd/4.0/"}
  :dependencies [[org.clojure/clojure "1.11.1"]
                 [markdown-clj "1.12.6"]
                 [clj-commons/clj-yaml "1.0.29"]
                 [hbs "1.1.0"]
                 [clj-rss "0.4.0"]]
  :repl-options {:init-ns my-blog.core})
