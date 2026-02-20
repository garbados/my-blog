(ns my-blog.entries 
  (:require
   [clj-yaml.core :as yaml]
   [markdown.core :as markdown]
   [my-blog.fs :refer [filter-dir split-first]]))

(def entries-dir "entries")
(def min-tags-for-link 2)

(defn slurp-entry [filepath]
  (let [entry-name (second (re-matches #"^.+\/(.+)\..+$" filepath))
        s (clojure.core/slurp filepath)
        [meta-yaml entry-md] (split-first #"\n\n" s)]
    (-> (yaml/parse-string meta-yaml)
        (update :description markdown/md-to-html-string)
        (merge
         {:name entry-name
          :slug (str entry-name ".html")
          :html (markdown/md-to-html-string entry-md)}))))

(defn -slurp-entries []
  (->> (filter-dir entries-dir :re #"^.*?\.md$")
       (map slurp-entry)))

(def slurp-entries (memoize -slurp-entries))

(defn group-by-tags [entries]
  (->> entries
       (reduce
        (fn [by-tags entry]
          (reduce
           (fn [by-tags tag]
             (update by-tags tag conj entry))
           by-tags
           (get-in entry [:meta :tags] [])))
        {})
       (filter
        (fn [[_tag tagged-entries]]
          (> (count tagged-entries) min-tags-for-link)))
       (reduce
        (fn [by-tags [tag entries]]
          (->> entries
               (sort-by #(get-in % [:meta :created_at]))
               (assoc by-tags tag)))
        {})))

(defn marshal-entries []
  (let [entries (slurp-entries)
        by-tags (group-by-tags entries)]
    {:entries entries
     :by-tags by-tags}))
