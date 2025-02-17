import {PhotoProvider, PhotoView} from 'react-photo-view';

type NodeType = {url: string; id: string};

type Props = {
  images: {node: NodeType}[];
};

export default function ProductImageViewer({images}: Props) {
  if (images.length === 1)
    return (
      <PhotoProvider>
        <div className="flex-1 -mx-4 md:-mx-0">
          <PhotoView key={images[0].node.id} src={images[0].node.url}>
            <img
              src={images[0].node.url}
              alt="product-image"
              className="object-cover cursor-pointer w-full h-full"
            />
          </PhotoView>
        </div>
      </PhotoProvider>
    );

  return (
    <PhotoProvider>
      <div className="images-container -mx-4 flex-1 md:-mx-0">
        {images.map((image, index: number) => (
          <PhotoView key={image.node.id} src={image.node.url}>
            <img
              src={image.node.url}
              alt="product-image"
              className={`${
                index === 0 ? 'main' : `grid-item-${index}`
              } object-cover cursor-pointer w-full h-full`}
            />
          </PhotoView>
        ))}
      </div>
    </PhotoProvider>
  );
}
