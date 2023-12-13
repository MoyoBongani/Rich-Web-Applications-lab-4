import React, { useState, useEffect } from 'react';
import './App.css';

const Weather = () => {
  const [city, setCity] = useState('Dublin');
  const [weather, setWeather] = useState(null);

  const fetchWeather = () => {
    fetch(`http://api.weatherapi.com/v1/current.json?key=c8b022afe8a34639ae7143627231212&q=${city}`)
      .then(response => response.json())
      .then(data => setWeather(data));
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  const handleCityChange = (e) => {
    setCity(e.target.value);
  };

  const handleFetchClick = () => {
    fetchWeather();
  };

  return (
    <div id="weather">
      <input type="text" value={city} onChange={handleCityChange} />
      <button onClick={handleFetchClick}>Fetch Weather</button>
      {weather && (
        <div>
          <h2>{weather.location.name}</h2>
          <p>{weather.current.condition.text}</p>
          <p>{weather.current.temp_c}°C</p>
        </div>
      )}
    </div>
  );
};
const App = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [color, setColor] = useState('rgb(245, 96, 96)'); // default color is red
  const [notes, setNotes] = useState(() => JSON.parse(localStorage.getItem('notes')) || []);
  const [error, setError] = useState('');
  const [category, setCategory] = useState('General'); // default category is General
  const [filter, setFilter] = useState('All');
  

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  const handleTitleChange = (e) => {
      setTitle(e.target.value);
      setError('');
  };

  const handleMessageChange = (e) => {
      setMessage(e.target.value);
      setError('');
  };

  const handleColorChange = (e) => {
      setColor(e.target.value);
  };

  const createNote = () => {
    if (!title || !message) {
      setError('Missing Values');
      return;
    }
  
    const note = {
      title,
      message,
      color,
      category, // add category to note
      date: new Date().toISOString(),
    };
  
    setNotes([note, ...notes]);
    setTitle('');
    setMessage('');
    setColor('');
    setCategory('General'); // reset category to default
  };

  const deleteNote = (index) => {
    const newNotes = [...notes];
    newNotes.splice(index, 1);
    setNotes(newNotes);
  };

  const editNote = (index) => {
    const note = notes[index];
    setTitle(note.title);
    setMessage(note.message);
    setColor(note.color);
    deleteNote(index);
  
    // Scroll to top
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const exportNotes = () => {
    const fileData = notes.map(note => `Title: ${note.title}\nMessage: ${note.message}\nCategory: ${note.category}\n\n`).join('');
    const blob = new Blob([fileData], {type: "text/plain"});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'notes.txt';
    link.href = url;
    link.click();
  };

  return (
    <div id="app">
      <div id="wrapper">
        <div id="editor">
            <h2 id="editor-title">Bongani's Note Taking App</h2>
            <label>Title:</label>
            <input type="text" id="title-input" value={title} onChange={handleTitleChange} placeholder="Title" />
            <label>Description:</label>
            <textarea id="message-input" rows="10" cols="42" value={message} onChange={handleMessageChange} placeholder="Message"></textarea>
            <label>Select Colour:</label>
            <select id="color-select" value={color} onChange={handleColorChange}>
              <option value="rgb(245, 96, 96)">Red</option>
              <option value="rgb(255, 189, 189)">Pink</option>
              <option value="rgb(255, 255, 119)">Yellow</option>
              <option value="rgb(157, 209, 246)">Blue</option>
            </select>
            <label>Category:</label>
            <select value={category} onChange={handleCategoryChange}>
              <option value="School">School</option>
              <option value="Work">Work</option>
              <option value="Hobby">Hobby</option>
              <option value="Home">Home</option>
              <option value="General">General</option>
            </select>
            <div id="button">
                <button id="create-button" onClick={createNote}>Create Note</button>
                {error && <div id="error">{error}</div>}
            </div>
        </div>
        <Weather />
      </div>

      <label id="filter-label">Filter by category:</label>
      <select value={filter} onChange={(e) => setFilter(e.target.value)}>
        <option value="All">All</option>
        <option value="School">School</option>
        <option value="Work">Work</option>
        <option value="Hobby">Hobby</option>
        <option value="Home">Home</option>
        <option value="General">General</option>
      </select>

      <button id="export-button" onClick={exportNotes}>Export Notes</button>

      <div id="notes-section">
          <h2>Notes</h2>
          <ul id="notes">
            {notes.filter(note => filter === 'All' || note.category === filter).map((note, index) => (
              <li key={index} className="note" style={{ backgroundColor: note.color }}>
                <div className="note-date">
  {note.date 
    ? `${new Date(note.date).toLocaleDateString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit' })}, ${new Date(note.date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}`
    : ''}
</div><h2>{note.title}</h2>
                <p>{note.message}</p>
                <h5>{note.category}</h5>
                <button className="edit-button" onClick={() => editNote(index)}>Edit</button>
                <button className="delete-button" onClick={() => deleteNote(index)}>Delete</button>
              </li>
            ))}
          </ul>
      </div>
    </div>
  );
};

export default App;