(ns my-blog.build 
  (:require
   [my-blog.entries :as entries]
   [my-blog.hbs :as hbs]))

(def out-dir "public/")

(defn build []
  (let [{:keys [by-tags entries]} (entries/marshal-entries)]
    ;; TODO list tags in sidebar of each page
    ;; index
    (spit (str out-dir "index.html")
          (hbs/render-to-str "index" entries))
    ;; entries
    (doseq [{:keys [slug] :as entry} entries
            :let [html (hbs/render-to-str "entry" entry)]]
      (spit (str out-dir slug) html))
    ;; tags
    (doseq [[tag entries] by-tags
            :let [params {:tag tag :entries entries}]]
      (spit (str out-dir "tag/" tag)
            (hbs/render-to-str "tag" params)))))
