import React from 'react';
import { getData } from '@/app/lib/_contentful/getData';
import { client } from '@/app/lib/_contentful/contentfulClient';
import { EntrySkeletonType } from 'contentful';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, Document, INLINES, MARKS, Text } from '@contentful/rich-text-types';
import Image from 'next/image';
import * as B from '@/app/_components/(blogs)/(ui)/uis';

const BlogContents = async ({
  params
}: {
  params: { slug: string }
}) => {

  const blogs = await getData();
  const id = blogs.items.find((item) => item.fields.slug === params.slug)?.sys.id;
  let blogBody: any;

  if (id) {
    const getBody = async () => {
      const body = await client.getEntries<EntrySkeletonType>({
        content_type: 'postBlog',
        'sys.id': id // 動的にIDを指定
      });
      return body;
    };
    const body = await getBody();

    blogBody = body;
  } else {
    return null;
  }

  return (
    <div id='blog-body' className='w-full h-full'>
      <div className='w-[70%] mx-auto [&>ol]:list-decimal [&>ol]:list-inside [&>ul]:list-disc [&>ul]:list-inside'>
        {documentToReactComponents(blogBody.items[0].fields.richText, {
          renderNode: {
            [BLOCKS.HEADING_1]: (_, children) => <B.HEADING_1 text={children} />,
            [BLOCKS.HEADING_2]: (_, children) => <B.HEADING_2 text={children} />,
            [BLOCKS.HEADING_3]: (_, children) => <B.HEADING_3 text={children} />,
            [BLOCKS.HEADING_4]: (_, children) => <B.HEADING_4 text={children} />,
            [BLOCKS.EMBEDDED_ASSET]: node => ( // imageの設定, width, heightの設定変更しよう
              <div className='relative w-[50%] h-auto mx-auto'>
                <Image
                  src={`https:${node.data.target.fields.file.url}`}
                  width={500}
                  height={500}
                  alt='img'
                  quality={100}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{ objectFit: 'contain', width: '100%', height: '100%' }}
                />
              </div>
            ),
            [BLOCKS.OL_LIST]: (node) =>  {
              const UnTaggedChildren = documentToReactComponents((node as Document), {
                renderNode: {
                  [BLOCKS.PARAGRAPH]: (_, children) => children,
                  [BLOCKS.LIST_ITEM]: (_, children) => <li>{children}</li>,
                },
              });
              return <>{UnTaggedChildren}</>;
            },
            [BLOCKS.UL_LIST]: (node) => {
              const UnTaggedChildren = documentToReactComponents((node as Document), {
                renderNode: {
                  [BLOCKS.PARAGRAPH]: (_, children) => children,
                  [BLOCKS.LIST_ITEM]: (_, children) => <li>{children}</li>,
                },
              });
              return <>{UnTaggedChildren}</>;
            },
            [BLOCKS.HR]: (_, children) => <B.HR />,
            [INLINES.HYPERLINK]: (node, children) => <B.HYPERLINK link={node.data.uri} text={children} />,
          },
          renderMark: {
            [MARKS.BOLD]: text => <B.BOLD text={text} />,
            [MARKS.ITALIC]: text => <B.ITALIC text={text} />,
            [MARKS.UNDERLINE]: text => <B.UNDERLINE text={text} />,
            [MARKS.SUPERSCRIPT]: text => <B.SUPERSCRIPT text={text} />,
            [MARKS.SUBSCRIPT]: text => <B.SUBSCRIPT text={text} />,
            [MARKS.CODE]: text => <B.CODE text={text} />,
          },
        })}
      </div>
    </div >
  );
}

export default BlogContents;