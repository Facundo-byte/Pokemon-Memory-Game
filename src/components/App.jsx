import { useState, useEffect } from 'react'
import '../styles/App.css'

const gurl = "https://pokeapi.co/api/v2/pokemon/";

export default function Memory() {
  const [numbers, setNumbers] = useState([]);
  const [clicked, setClicked] = useState(false);
  const [positions, setPositions] = useState([]);
  const [points, setPoints] = useState(0);
  const [record, setRecord] = useState(0);

  // fill random numbers array
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max-min) + min)
  }

  function handleClick(num){
    const altpositions = [...positions];
    if(altpositions[num] > 0){
      setPoints(0)
      const resetpositions = altpositions.map(() => 0);
      setPositions(resetpositions);
      if(points > record){
        setRecord(points);
      }
    }
    else{
      altpositions[num]++;
      setPoints(points + 1);
      setPositions(altpositions);
    }
    
    setClicked(!clicked)
  }

  function handleButton(){
    setPoints(0);
    setRecord(0);
  }
  useEffect(() => {
    const allPositions = Array.from({length: 50}, () => 0);
    setPositions(allPositions); 
  }, [])

  useEffect(() =>{
    const newNumbers = Array.from({length: 9}, () => getRandomInt(0,50));
    setNumbers(newNumbers);
  }, [clicked])
  
  //show things
  return (
    <div id= "maincontainer">
      <h1>Pokemon Memory Game</h1>
      <p>Get points by clicking on an image but dont click on any more than Once!</p>
      <p>points: {points} , record: {record}</p>
      <button onClick ={() => handleButton()}>Restart</button>
      <ul id="itemscontainer">
        {numbers.length === 9 && numbers.map((num,index) => 
          (<li key={index} onClick={() => handleClick(num)}> <Item element = {num} url = {gurl}/> </li>
          ))}
      </ul>
    </div>
  )
}

export function Item({element, url}){
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(()=> {
      const fetchPokemon = async() => {
        try{
          const response = await fetch(url + element);
          const data = await response.json();
          setPokemon(data);
        }
        catch(error){
          console.error(error);
        }
        finally{
          setLoading(false);
        }
      }

  fetchPokemon();
    }, [element, url])

  if(loading || !pokemon){
    return(
      <p>Cargando...</p>
    )
  }

  return( 
    <div className= "item">
      <h2 className="pname">{pokemon.forms[0].name}</h2>
      <img className="pimage" src={pokemon.sprites.front_default} alt="non"/>
    </div>
  )
}
