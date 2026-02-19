(ns my-blog.hbs
  (:require [hbs.core :as hbs]))

(def reg (hbs/registry (hbs/file-loader "resources/hbs" ".hbs")))
