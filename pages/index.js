import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [formData, setFormData] = useState({
    age: "",
    weight: "",
    height: "",
    gender: "",
    activityLevel: "",
  });
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }

      setResult(data.result);
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  }

  function createMarkup() {
    return { __html: result };
  }

  return (
    <div>
      <Head>
        <title>Diet Plan Generator</title>
        <link rel="icon" href="/diet.png"/>
      </Head>

      <main className={styles.main}>
        <h3>Generate a personalized 3-day diet plan</h3>
        <img src="/salad.png" width="100px"/>
        <form onSubmit={onSubmit}>
          <input
            type="number"
            name="age"
            placeholder="Enter your age"
            value={formData.age}
            onChange={handleChange}
          />
          <input
            type="number"
            name="weight"
            placeholder="Enter your weight (in kg)"
            value={formData.weight}
            onChange={handleChange}
          />
          <input
            type="number"
            name="height"
            placeholder="Enter your height (in cm)"
            value={formData.height}
            onChange={handleChange}
          />
          <select name="gender" value={formData.gender} onChange={handleChange}>
            <option value="">Select your gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <select
            name="activityLevel"
            value={formData.activityLevel}
            onChange={handleChange}
          >
            <option value="">Select your activity level</option>
            <option value="sedentary">Sedentary</option>
            <option value="lightly active">Lightly active</option>
            <option value="moderately active">Moderately active</option>
            <option value="very active">Very active</option>
          </select>
          <input type="submit" value="Generate Diet Plan" />
        </form>
        <div
          className={styles.result}
          dangerouslySetInnerHTML={createMarkup()}
        />
      </main>
    </div>
  );
}
