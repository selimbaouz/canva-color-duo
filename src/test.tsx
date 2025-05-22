import {
  Button,
  ColorSelector,
  FormField,
  Rows,
  Text,
  Title,
} from "@canva/app-ui-kit";
import { useState } from "react";
import chroma from "chroma-js";
import * as styles from "styles/components.css";

function App() {
  const [baseColor, setBaseColor] = useState("#3498db");
  const [generatedColor, setGeneratedColor] = useState("#db3449");

  const generateComplementaryColor = (color: string) => {
    return chroma(color).set("hsv.h", "+0.5").hex();
  };

  const handleColorChange = (color: string) => {
    setBaseColor(color);
    setGeneratedColor(generateComplementaryColor(color));
  };

  const copyToClipboard = (color: string) => {
    navigator.clipboard.writeText(color).then(() => {
      alert("Code couleur copié !");
    });
  };

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="2u">
        <Title size="large">Générateur de Couleur Duo</Title>

        <Text>
          Choisissez une couleur de base pour générer sa complémentaire
          automatiquement
        </Text>

        <FormField
          label="Couleur de base"
          control={() => (
            <ColorSelector color={baseColor} onChange={handleColorChange} />
          )}
        />

        <Title size="medium">Association de couleurs</Title>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "16px",
            margin: "16px 0",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: "100px",
                height: "100px",
                backgroundColor: baseColor,
                borderRadius: "5px",
                marginBottom: "8px",
                cursor: "pointer",
              }}
              onClick={() => copyToClipboard(baseColor)}
            />
            <Text>{baseColor}</Text>
          </div>

          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: "100px",
                height: "100px",
                backgroundColor: generatedColor,
                borderRadius: "5px",
                marginBottom: "8px",
                cursor: "pointer",
              }}
              onClick={() => copyToClipboard(generatedColor)}
            />
            <Text>{generatedColor}</Text>
          </div>
        </div>

        <Button
          variant="primary"
          onClick={() => copyToClipboard(`${baseColor}, ${generatedColor}`)}
          stretch
        >
          Copier les couleurs
        </Button>
      </Rows>
    </div>
  );
}

export default App;
