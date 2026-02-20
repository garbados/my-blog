(ns my-blog.fs 
  (:require
   [clojure.java.io :as io]
   [clojure.string :as string]))

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
