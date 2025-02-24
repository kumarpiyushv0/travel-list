import { useState } from "react";


export default function App() {
  const [items, setItems] = useState([]);
  const numItems =  items.length;
  const numPacked = items.filter((item)=> item.packed).length;

  function handleAddItems(item){
    setItems((items)=>[...items, item]);
  }

  function handleDeleteItems(id){
    setItems((items)=> items.filter((items)=> items.id !== id));
  }

  function handleToggleItems(id){
    setItems((items)=> items.map(item=> item.id === id?{...item, packed: !item.packed} : item))
  }

  function handleClearList(){
    const confirmed = window.confirm("Clear List!!!!");
    if(confirmed) setItems([]);
  }

  return (
    <div className="app">
      <Logo/>
      <Form onAddItems={handleAddItems}/>
      <PackingList items={items} onDeleteItems={handleDeleteItems} onToggleItems={handleToggleItems} onClearList={handleClearList}/>
      <Stats numItems={numItems} numPacked={numPacked} />
    </div>
  );
}

function Logo(){
  return <h1>Far Away </h1>
}

function Form({onAddItems}){

  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);

  function handleSubmit(e){
    e.preventDefault();
    if(!description) return;
    const newItem = { description, quantity, packed: false, id: Date.now()};
    onAddItems(newItem);
    setDescription("");
    setQuantity(1);
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <h3>What do you need for your trip?</h3>
      <select value={quantity} onChange={(e)=>setQuantity(Number(e.target.value))}>
        {Array.from({length:20}, (_,i)=>i+1).map(num=>
          <option value={num} key={num}>{num}</option>
        )}
        
      </select>
      <input type="text" placeholder="Item..." value={description}
      onChange={(e)=> setDescription(e.target.value)}/>
      <button>Add</button>
    </form>
  );
}

function PackingList({items, onDeleteItems ,onToggleItems, onClearList}){
  return(
    <div className="list">
      <ul>
      {items.map((item)=>(
        <Item item={item} onDeleteItems={onDeleteItems} onToggleItems={onToggleItems} key={item.id}/>
      ))}
    </ul>
    <button onClick={onClearList}>CLEAR LIST</button>
    </div> 
  );
}

function Item({item, onDeleteItems, onToggleItems}){
  return (
    <div>
      <li>
        <input type="checkbox" value={item.packed} onChange={()=>onToggleItems(item.id)}/>
        <span style={item.packed ? {textDecoration:"line-through"}: {}}> 
          {item.quantity} {item.description}</span>
        <button onClick={()=> onDeleteItems(item.id)}>&#x2716;</button>
      </li>
    </div>
  );

}

function Stats({numItems, numPacked}){
  if(!numItems){
    return(
      <footer className="stats">
      <em> Start adding some items for your trip </em>
    </footer>
    );
  }
  const percentage= Math.round((numPacked/numItems)*100);

  if(percentage === 100){
    return(
    <footer className="stats">
      <em> You have packed {percentage}% and ready to go for your trip </em>
    </footer>
    );
  }
  return (
    <footer className="stats">
      <em>You have {numItems-numPacked} items on your list, and you already packed {numPacked} ({percentage}%)</em>
    </footer>
  )
}