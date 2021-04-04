import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

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
          <title>{post.title} | Ignews</title>
       </Head>
        <main className={styles.container}>
            <article className={styles.post}>
              <h1>{post.title}</h1>
              <time>{post.updatedAt}</time>
              {/* <div 
                  className={styles.postContainer}
                  dangerouslySetInnerHTML ={{ __html: post.content}} 
              /> */}
            </article>
        </main>
     </>
  )

}

export const getStaticPaths = async () => {
  // const prismic = getPrismicClient();
  // const posts = await prismic.query(TODO);

  // TODO


};

export const getStaticProps = async context => {
  // const prismic = getPrismicClient();
  // const response = await prismic.getByUID();

  
  // TODO
};
