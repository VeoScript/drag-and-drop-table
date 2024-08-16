import { useRef, useState } from "react";
import "./App.css";

type Asset = {
  id: number;
  imageSrc: string;
  category: string;
};

function App() {
  const [categories, setCategories] = useState<{
    [key: string]: Asset[];
  }>({
    blackpink: [
      {
        id: 1,
        imageSrc:
          "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcTIOIzWtmIMbUfoyV4VhJxkCqH42Pbi9sNnHfK9B7aCf_vgsIWV",
        category: "blackpink",
      },
      {
        id: 2,
        imageSrc:
          "https://nationaltoday.com/wp-content/uploads/2022/10/49-Roseanne-Park-1200x834.jpg",
        category: "blackpink",
      },
      {
        id: 3,
        imageSrc:
          "https://www.hollywoodreporter.com/wp-content/uploads/2023/05/Jennie-Kim-2023-Met-Gala-getty-1486924742-H-2023.jpg",
        category: "blackpink",
      },
      {
        id: 4,
        imageSrc:
          "https://media.themoviedb.org/t/p/w500/nuyUmcYeg4ROZNzAEx3ZxILGQ5Y.jpg",
        category: "blackpink",
      },
    ],
    newjeans: [
      {
        id: 5,
        imageSrc:
          "https://www.j-14.com/wp-content/uploads/2023/07/newjeans-hanni.-.jpg?fit=800%2C1200&quality=86&strip=all",
        category: "newjeans",
      },
      {
        id: 6,
        imageSrc:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/20230905_Haerin_%28NewJeans%29.jpg/640px-20230905_Haerin_%28NewJeans%29.jpg",
        category: "newjeans",
      },
      {
        id: 7,
        imageSrc:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWx-H6WJIYxRhOxJ7QFYfWvXVFIVgYU_BFOp9lbdtxeD_xFc9raHOjofs6D66l_ArMOYs&usqp=CAU",
        category: "newjeans",
      },
      {
        id: 8,
        imageSrc:
          "https://static.tnn.in/thumb/msid-109955940,thumbsize-875716,width-1280,height-720,resizemode-75/109955940.jpg?quality=100",
        category: "newjeans",
      },
      {
        id: 9,
        imageSrc:
          "https://pbs.twimg.com/media/GMGghwyXcAA69Dj?format=jpg&name=large",
        category: "newjeans",
      },
    ],
  });

  const containerRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    assetId: number,
    category: string
  ) => {
    e.dataTransfer.setData("assetId", assetId.toString());
    e.dataTransfer.setData("category", category);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    newCategory: string
  ) => {
    e.preventDefault();
    const assetId = parseInt(e.dataTransfer.getData("assetId"), 10);
    const oldCategory = e.dataTransfer.getData("category");

    if (oldCategory !== newCategory) {
      setCategories((prevCategories) => {
        const oldAssets = prevCategories[oldCategory].filter(
          (asset) => asset.id !== assetId
        );
        const movedAsset = prevCategories[oldCategory].find(
          (asset) => asset.id === assetId
        );

        if (movedAsset) {
          return {
            ...prevCategories,
            [oldCategory]: oldAssets,
            [newCategory]: [
              ...prevCategories[newCategory],
              { ...movedAsset, category: newCategory },
            ],
          };
        }

        return prevCategories;
      });
    }
  };

  const handleScrollOnDrag = (e: React.DragEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!container) return;

    const { top, bottom } = container.getBoundingClientRect();
    const buffer = 50; // Distance from the edge to start scrolling
    const scrollSpeed = 20; // Pixels per event

    if (e.clientY < top + buffer) {
      container.scrollBy(0, -scrollSpeed);
    } else if (e.clientY > bottom - buffer) {
      container.scrollBy(0, scrollSpeed);
    }
  };

  const handlePageScrollOnDrag = (e: React.DragEvent<HTMLDivElement>) => {
    const buffer = 50; // Distance from the edge to start scrolling
    const scrollSpeed = 20; // Pixels per event

    if (e.clientY < buffer) {
      window.scrollBy(0, -scrollSpeed);
    } else if (e.clientY > window.innerHeight - buffer) {
      window.scrollBy(0, scrollSpeed);
    }
  };

  return (
    <div
      ref={containerRef}
      onDragOver={(e) => {
        handleDragOver(e);
        handleScrollOnDrag(e);
      }}
      style={{ overflowY: "auto" }}
    >
      <div>
        {Object.keys(categories).map((category) => (
          <div
            key={category}
            onDragOver={(e) => {
              handleDragOver(e);
              handlePageScrollOnDrag(e);
            }}
            onDrop={(e) => handleDrop(e, category)}
          >
            <h2>{category}</h2>
            {categories[category].map((asset) => (
              <div
                key={asset.id}
                draggable
                onDragStart={(e) => handleDragStart(e, asset.id, category)}
                style={{
                  border: "1px solid #000",
                  padding: "10px",
                  margin: "5px",
                  cursor: "move",
                }}
              >
                <p>{asset.id}</p>
                <img
                  src={asset.imageSrc}
                  alt={`Asset ${asset.id}`}
                  style={{ width: "50px" }}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
