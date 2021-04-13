import { format, formatDistance } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { RichText } from 'prismic-dom';
import Prismic from '@prismicio/client';

import { FiCalendar, FiUser } from 'react-icons/fi';

import { useState, useEffect, ReactElement } from 'react';
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

export default function Home({postsPagination}: HomeProps) : JSX.Element{
  // TODO


  const [posts, setPosts] = useState<Post[]>(postsPagination.results);
  const [nextPage, setNextPage] = useState(postsPagination.next_page);
  const [handleLoadMoreposts, setHandleLoadMoreposts] = useState(
    !!postsPagination.next_page
  );
  // const [currentPage, setCurrentPage] = useState(1);

  function handlePagination(): void {
    fetch(postsPagination.next_page)
      .then(res => res.json())
      .then(response => {
        const newPosts = response.results.map(post => {
          return {
            uid: post.uid,
            first_publication_date:  format(new Date(post.first_publication_date), 
            'dd MMM yyyy', {
              locale: ptBR,
            }),
            data: {
              title: RichText.asText(post.data.title),
              subtitle: RichText.asText(post.data.subtitle),
              author: RichText.asText(post.data.author)
            }
          };
        });
        setPosts([...posts, ...newPosts]);
        setHandleLoadMoreposts(!!newPosts.next_page);
      });
  }

  
  
  
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
              
            </main>

            
          ))}

          {handleLoadMoreposts && (
            <button type="button" onClick={handlePagination}>
              Carregar mais posts
            </button>
        )}
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


  const posts = response.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date:  format(new Date(post.first_publication_date), 
      'dd MMM yyyy', {
        locale: ptBR,
      }),
      data: {
        title: RichText.asText(post.data.title),
        subtitle: RichText.asText(post.data.subtitle),
        author: RichText.asText(post.data.author)
      }
    };
  });


  const postsPagination = {
    next_page: response.next_page, 
    results:posts
  }

  return {
    props: {
      postsPagination
    },
    revalidate: 60 * 60 * 24,
  };
};
