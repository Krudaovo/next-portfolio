import Title from '../_components/title';

const ContentLayout = ({
  children
}: {
  children: React.ReactNode
}) => {
  return ( 
    <main className='col-span-5 w-full h-auto'>
      <div className='w-auto h-auto mt-5 ml-7'>
        <Title isInSide /> {/* trueで no text-center */}
      </div>
      <div className='w-full h-auto mt-32'>
        {children}
      </div>
    </main>
   );
}
 
export default ContentLayout;