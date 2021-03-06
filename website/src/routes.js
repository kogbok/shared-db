import React from "react"
import { Route } from "react-router"
import { PageContainer as PhenomicPageContainer } from "phenomic"

import AppContainer from "./AppContainer"
import Page from "./layouts/Page"
import PageError from "./layouts/PageError"
import Homepage from "./layouts/Homepage"
import Post from "./layouts/Post"

import _Page from "./layouts/_Page"
import _Documentation from "./layouts/_Documentation"
import _Home from "./layouts/_Home"

const PageContainer = (props) => (
  <PhenomicPageContainer
    { ...props }
    layouts={{
      Page,
      PageError,
      Homepage,
      Post,
      _Page,
      _Documentation,
      _Home,
    }}
  />
)

export default (
  <Route component={ AppContainer }>
    <Route path="*" component={ PageContainer } />
  </Route>
)
