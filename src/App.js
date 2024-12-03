import React, { useState, useRef, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [allinput,setAllInput] = useState(["",""]);
  const [thetext,setTheText] = useState([]);
  const therefs = useRef(null || []);
  const [minute,setMinute] = useState(0);
  const [second,setSecond] = useState(0);
  const [time,setTime] = useState(0);
  const [starttime,setStartTime] = useState(false);
  const intervalRef = useRef(null);
  const [stop,setStop] = useState(false);
  const [inputlength,setInputLength] = useState(0);
  const [wpm,setWpm] = useState(0);

  const theparagraph = 
    `
      Once upon a time in a mystical forest, there lived a clever fox named Finn and a laid-back dog named Duke. Finn loved running and exploring, while Duke preferred napping under the shade of a tree. One sunny day, Finn challenged Duke to a race to prove who was faster.

      “Let’s race across the meadow to the big oak tree,” Finn declared confidently. Duke, yawning, agreed, thinking it would be a good excuse to stretch his legs.

      As they raced, Finn darted ahead, leaping over rocks and streams. Duke, however, trotted leisurely, stopping occasionally to sniff flowers and chase butterflies.

      But suddenly, Finn stumbled on a tricky path filled with fallen leaves, and Duke caught up, laughing, “You’re fast, but I take my time to enjoy the journey!”
    `;

  function divideparagraph() {
    const nospace = theparagraph.trim().replace(/\s+/g, ' ');
    let chunks = [];
    let start = 0;
    while (start < nospace.length) {
      let chunk = nospace.slice(start,start + 56);
      if ( chunk.length < 47 && nospace[start+47] !== ' ' && nospace[start+47] !== undefined) {
        const lastspace = chunk.lastIndexOf(' ');
        if (lastspace !== -1) {
          chunk = chunk.slice(0,lastspace);
          start += lastspace +1;
        } else {
          start += 47
        }
      } else {
        start += chunk.length;
      }
      chunks.push(chunk);
    }
    
    setTheText(chunks);
    console.log(thetext);

  };

  useEffect(() => {
    divideparagraph();
  },[]);


  function handlethetext(input,target) {

    return target.split("").map((letter,index) => {

      const color = input[index] === letter ? 'green' : input[index] ? 'red' : 'black';

      return (
        <span key={index} style={{color}}>
          {letter}
        </span>
      );
    });
  };

  function handleInputChange(id,e ) {
    const updatedInputs = [...allinput];
    updatedInputs[id] = e;
    setAllInput(updatedInputs);

    if (e.length >= thetext[id].length && id + 1 < thetext.length) {
      therefs.current[id + 1]?.focus();
      console.log('true');
    }

    if (e.length >= thetext[id].length && id + 1 >= thetext.length ) {
      setStop(true);
    };

    setInputLength(e.length);
    console.log(inputlength)
  };

  useEffect(() => {
    if (thetext.length > 0) {
      therefs.current = thetext.map((_,i) => therefs.current[i] || React.createRef());
    };
    console.log(therefs)
  },[thetext]);

  function timefun() {
    if (stop) {
      setStartTime(false);
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setWpm((inputlength / 5) / second);
      alert('See your result')
      return;
    }
    if (starttime === true) {
      if (!intervalRef.current) {
        intervalRef.current = setInterval(() => {
          setTime(pre => {
            if (pre === 60) {
              
              setMinute(pre => pre +1)
              return pre = 1;
            } else {
              return pre += 1;
            }
          });
          setSecond(pre => (pre +1)/60 );
        },1000);
      }
    } else if ( !starttime && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }

  useEffect(() => {
    timefun();
  },[starttime,stop]);

  return (
    <div className="App">
      <div className="container">
         {
          thetext.map((text,index) => (
            <div
            key={index}
            >
              <p>{handlethetext(allinput[index] || '',text)}</p>
              <input
              key={index}
              ref={(el)=>(therefs.current[index] = el)}
              placeholder='_____'
              onChange={e => {
                handleInputChange(index,e.target.value);
                setStartTime(true);
              }}
              value={allinput[index] || ''}
              >
              </input>
            </div>
          ))
         }
      </div>
      <p className='time'>Time : {minute > 0 ? minute+' m' : ''} {time} s</p>
      <p className='time'>{wpm.toFixed(0)} WPM</p>
    </div>
  );
}

export default App;
