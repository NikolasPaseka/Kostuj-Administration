import { useEffect, useState } from 'react'
import {Button} from "@nextui-org/react";

const HomePage = () => {
  const [catalogues, setCatalogues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCatalogues = async () => {
      const res = await fetch("https://kostuj-be-production.onrender.com/catalogues?page=1&limit=10");
      const data = await res.json();
      setLoading(false);
      setCatalogues(data);
    }

    fetchCatalogues();
  }, [])


  return (
    <>
      <Button color='primary'>Click Me</Button>
      <h1 className="text-6xl font-bold">Kostuj Administration</h1>
      <div>
        {loading && <p>Loading...</p>}
        {catalogues.map((catalogue: any) => (
          <div key={catalogue.id}>
            <h2>{catalogue.title}</h2>
            <p>{catalogue.description}</p>
          </div>
        ))}
      </div>
    </>
  )
}

export default HomePage