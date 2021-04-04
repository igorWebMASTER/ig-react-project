import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { RichText } from 'prismic-dom';
import Prismic from '@prismicio/client';

import { FiCalendar, FiUser } from 'react-icons/fi';

import { useState } from 'react';
import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import Header from '../components/Header';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({postsPagination}: HomeProps): JSX.Element {
  // TODO

 
  const [posts, setPosts] = useState<Post[]>(postsPagination.results);


  return (
    <>
      <Header />

      <div
        className={`${commonStyles.commonContainer} ${styles.ContainerHome}`}
      >
        {posts.map(post => (
            <main className={styles.container} key={post.uid}>
                <Link href={`/post/${post.uid}`}>
              <div className={styles.posts}>           
                  <a>
                    <h1>{post.data.title}</h1>
                  </a>
                
                <p>{post.data.subtitle}</p>
                <div className={commonStyles.commonInfo}>
                  <div>
                    <FiCalendar color="#B8B8B8" /> <span> {post.first_publication_date} </span>
                  </div>
                  <div>
                    <FiUser color="#B8B8B8" /> <span>{post.data.author}</span>
                  </div>
                </div>
              </div>
              
              </Link>


              {postsPagination.next_page && (
                <h2>
                  <button type="button">
                    Carregar posts
                  </button>
                </h2>
              )}
            </main>
          ))}
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({preview= false}) => {
  const prismic = getPrismicClient();

  const response = await prismic.query(
    [Prismic.predicates.at('document.type', 'posts')],
    {
      pageSize: 1,
    }
  );

  // console.log(response);

  const posts = response.results.map(post => {
    return {
      uid: post.uid,
      first_publication_data: format(new Date(post.first_publication_date), 'dd MMM yyyy', {
          locale: ptBR,
        }),
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author
      },
      // slug: post.uid,
      // title: RichText.asText(post.data.title),
      // subtitle: RichText.asText(post.data.subtitle),
      // author: RichText.asText(post.data.author),
      // updatedAt: format(new Date(post.last_publication_date), 'dd MMM yyyy', {
      //   locale: ptBR,
      // }),
    };
  });

  const postsPagination = {
    next_page : response.next_page,
    results: posts,
  }

  return {
    props: {
      postsPagination,
      preview,
    },
    revalidate: 60 * 60 * 24,
  };
};
