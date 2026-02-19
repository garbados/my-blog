(ns my-blog.hbs
  (:require [hbs.core :as hbs]))

(def reg (hbs/registry (hbs/file-loader "resources/hbs" ".hbs")))

(defn render-to-str [template params]
  (clojure.string/trim (hbs/render-file reg template params)))
