import React, { PropTypes } from "react"
import Helmet from "react-helmet"
import warning from "warning"
import { BodyContainer, joinUri, Link } from "phenomic"

import Button from "../../components/Button"
import Loading from "../../components/Loading"

import styles from "./index.css"

const Documentation = (
  {
    isLoading,
    __filename,
    __url,
    head,
    body,
    header,
    footer,
    children,
  },
  {
    metadata: { pkg },
  }
) => {
  warning(
    typeof head.title === "string",
    `Your page '${ __filename }' needs a title`
  )

  const metaTitle = head.metaTitle ? head.metaTitle : head.title

  const socialImage = head.hero && head.hero.match("://") ? head.hero
    : joinUri(process.env.PHENOMIC_USER_URL, head.hero)

  const meta = [
    { property: "og:type", content: "article" },
    { property: "og:title", content: metaTitle },
    {
      property: "og:url",
      content: joinUri(process.env.PHENOMIC_USER_URL, __url),
    },
    { property: "og:image", content: socialImage },
    { property: "og:description", content: head.description },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:title", content: metaTitle },
    { name: "twitter:creator", content: `@${ pkg.twitter }` },
    { name: "twitter:description", content: head.description },
    { name: "twitter:image", content: socialImage },
    { name: "description", content: head.description },
  ]

  return (
    <div className={ styles.page }>
      <Helmet
        title={ metaTitle }
        meta={ meta }
      />
      {
        <div
          className={ styles.hero }
          style={ head.hero && {
            background: `#111 url(${ head.hero }) 50% 50% / cover`,
          } }
        >
          <div className={ styles.header }>
          </div>
        </div>
      }
      <div className={ styles.wrapper + " " + styles.pageContent }>
        { header }
        <div className={ styles.body }>
         <iframe src="../docs2/index.html" seamless style={{border: "none", width: "100%", height: "100%", position: "absolute"}}/>
        </div>
        { children }
        { footer }
      </div>
    </div>
  )
}

Documentation.propTypes = {
  children: PropTypes.node,
  isLoading: PropTypes.bool,
  __filename: PropTypes.string,
  __url: PropTypes.string,
  head: PropTypes.object.isRequired,
  body: PropTypes.string,
  header: PropTypes.element,
  footer: PropTypes.element,
}

Documentation.contextTypes = {
  metadata: PropTypes.object.isRequired,
}

export default Documentation
