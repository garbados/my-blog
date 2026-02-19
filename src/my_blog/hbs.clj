(ns my-blog.hbs
  (:require [hbs.core :as hbs]))

(def reg (hbs/registry (hbs/classpath-loader "resources/hbs" ".hbs")))
