(ns my-blog.core 
  (:require
   [clojure.java.io :as io]
   [clojure.string :as string]
   [markdown.core :as markdown]
   [clj-yaml.core :as yaml]))

(def resource-dir "resources")
(def sep "/")

(defn join [& args]
  (str (string/join sep (cons resource-dir args)) sep))

(defn split-first [re s]
  (string/split s re 2))

(defn slurp-dir [path]
  (->> (join path)
       io/file
       clojure.core/file-seq
       (filter #(.isFile %))
       (map #(.getPath %))
       (filter (partial re-matches #"^.*?\.md$"))
       (map clojure.core/slurp)))

(defn parse-entry [s]
  (let [[meta-yaml entry-md] (split-first #"\n\n" s)]
    {:meta (yaml/parse-string meta-yaml)
     :body (markdown/md-to-html-string entry-md)}))

(defn gather-entries []
  (->> (slurp-dir "entries")
       (map parse-entry)))

(defn group-by-tags [entries]
  (reduce
   (fn [by-tags entry]
     (reduce
      (fn [by-tags tag]
        (update by-tags tag conj entry))
      by-tags
      (get-in entry [:meta :tags] [])))
   {}
   entries))

;; parse entries
;; organize by tags
;; create links