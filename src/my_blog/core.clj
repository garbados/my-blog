(ns my-blog.core 
  (:require
   [clojure.java.io :as io]
   [clojure.string :as string]
   [markdown.core :as markdown]
   [clj-yaml.core :as yaml]))

(def resource-dir "resources")
(def entries-dir "entries")
(def min-tags-for-link 2)
(def sep "/")

(defn join [& args]
  (str (string/join sep args) sep))

(defn split-first [re s]
  (string/split s re 2))

(defn walk-dir [path]
  (->> (join path)
       io/file
       clojure.core/file-seq
       (filter #(.isFile %))
       (map #(.getPath %))))

(defn filter-dir [path & {:keys [re] :or {re #"^.*$"}}]
  (->> (walk-dir path)
       (filter (partial re-matches re))))

(defn slurp-entry [filepath]
  (let [entry-name (second (re-matches #"^.+\/(.+)\..+$" filepath))
        s (clojure.core/slurp filepath)
        [meta-yaml entry-md] (split-first #"\n\n" s)]
    {:name entry-name
     :meta (yaml/parse-string meta-yaml)
     :body (markdown/md-to-html-string entry-md)}))

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
     :by-tags by-tags
    ;;  TODO pair link to hbs output
     :links
     (concat
      (map :name entries)
      (map (partial str "entries/") (map :name entries))
      (map (partial str "tags/") (keys by-tags)))}))
