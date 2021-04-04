import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';

import { getPrismicClient } from '../../services/prismic';

import Prismic from '@prismicio/client';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import { RichText } from 'prismic-dom';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post(post: PostProps) {
  // TODO
  return (
    <>
       <Head>
          <title>{post.data.title} | Ignews</title>
       </Head>
        <main className={styles.container}>
            <article className={styles.post}>
              <h1>{post.data.title}</h1>
              <time>{post.data.author}</time>
              {/* <div 
                  className={styles.postContainer}
                  dangerouslySetInnerHTML ={{ __html: post.content}} 
              /> */}
            </article>
        </main>
     </>
  )

}

export const getStaticPaths : GetStaticPaths = async params => {
  const { slug } = params;
  
  const prismic = getPrismicClient();
  
  const posts = await prismic.query([
    Prismic.predicates.at('documents.type', 'posts'),
  ]);

  const paths  = posts.results.map(post => ({
    params: {slug: post.uid},
  }))


  return {
    paths,
    fallback: true,
  }

};

export const getStaticProps  = async context => {
  const {slug} = context.query;
  
  const prismic = getPrismicClient();
  
  // TODO
  const response = await prismic.getByUID('post', String(slug), {});


  const post = {
    first_publication_date: response.first_publication_date,
    ...response, //Faço o spread aqui

    data: {
      ...response.data, //E aqui também
      title: response.data.title,
      banner: response.data.banner,
      author: response.data.author,

      content: response.data.content.map(item => {
        // item.text = RichText.asText(item.body);
        item.body = RichText.asHtml(item.body);
        return item;
      }),
    },
  };

};
