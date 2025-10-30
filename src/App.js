import React, { useState } from "react";
import axios from "axios";
import "./styles.css";

function App() {
  const [variant, setVariant] = useState("text"); // text или html
  const [property, setProperty] = useState({
    type: "",
    district: "",
    area: "",
    price: "",
    rooms: "",
    floor: "",
    bathrooms: "",
    basement: false,
    terrace: false,
    parking: false,
    furnishing: "",
    extras: "",
    notes: ""
  });
  const [output, setOutput] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProperty({
      ...property,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const generate = async () => {
    // Събира само попълнените полета
    let filledFields = Object.entries(property)
      .filter(([key, val]) => val !== "" && val !== false)
      .map(([key, val]) => {
        if (typeof val === "boolean") return key + ": Да";
        return `${key}: ${val}`;
      })
      .join(", ");

    const prompt = `
Напиши обява за имот във Варна с характеристиките: ${filledFields}.
Вариант: ${variant === "text" ? "Само текст" : "HTML обява с оформление"}.
Добави моите данни: 0893366051 – Димитър Ценов – Компас Недвижими Имоти, compassrealestate.bg, „Когато посоката е вярна…!“
Добави логото: https://compassrealestate.bg/compass-logo.png
Стил: приятелски, доверителен, професионален за социални мрежи.
    `;

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 800
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer YOUR_API_KEY_HERE`
          }
        }
      );
      setOutput(response.data.choices[0].message.content);
    } catch (err) {
      console.error(err);
      setOutput("Грешка при генериране.");
    }
  };

  return (
    <div className="App">
      <h1>Генератор на обяви – Compass</h1>

      <div className="form">
        <label>Вариант:</label>
        <select value={variant} onChange={(e) => setVariant(e.target.value)}>
          <option value="text">Само текст</option>
          <option value="html">HTML обява</option>
        </select>

        {Object.keys(property).map((key) => (
          <div key={key}>
            <label>{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
            {typeof property[key] === "boolean" ? (
              <input
                type="checkbox"
                name={key}
                checked={property[key]}
                onChange={handleChange}
              />
            ) : (
              <input
                name={key}
                value={property[key]}
                onChange={handleChange}
                placeholder={key}
              />
            )}
          </div>
        ))}

        <button onClick={generate}>Генерирай обява</button>
      </div>

      <div className="output">
        <h2>Резултат:</h2>
        <pre>{output}</pre>
      </div>
    </div>
  );
}

export default App;
