(ns my-blog.hbs
  (:require
   [clojure.string :as string]
   [hbs.core :as hbs]))

(def reg (hbs/registry (hbs/file-loader "resources/hbs" ".hbs")))

(defn render-to-str [template params]
  (string/trim (hbs/render-file reg template params)))
