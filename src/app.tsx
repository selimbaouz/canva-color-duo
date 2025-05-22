import {
  Button,
  ColorSelector,
  FormField,
  Rows,
  ReloadIcon,
  Text,
  Title,
} from "@canva/app-ui-kit";
import { addElementAtPoint, initAppElement } from "@canva/design";
import { useEffect, useState } from "react";
import * as styles from "styles/components.css";
import chroma from "chroma-js";
import { useIntl } from "react-intl";

type AppElementData = {
  colors: string[];
};

const appElementClient = initAppElement<AppElementData>({
  render: (data) => [
    {
      type: "text",
      top: 0,
      left: 0,
      ...data,
      children: [],
    },
  ],
});

export const App = () => {
  const [baseColor, setBaseColor] = useState("#ffb6b6");
  const [colorPairs, setColorPairs] = useState<string[]>([]);
  const [copiedPrimaryIndex, setCopiedPrimaryIndex] = useState<number | null>(null);
  const [copiedSecondaryIndex, setCopiedSecondaryIndex] = useState<number | null>(null);
  const { formatMessage } = useIntl();

  useEffect(() => {
    appElementClient.registerOnElementChange(() => {});
    generateColors("#ffb6b6");
  }, []);

  const generateColors = (base: string) => {
    const colors: string[] = [];
  
    // Générer les couleurs, en s'assurant qu'il n'y a pas de doublon
    while (colors.length < 6) {
      const newColor = chroma(base).set("hsl.h", Math.random() * 360).hex();
  
      // Vérifier si la couleur générée est déjà présente dans la palette
      if (!colors.includes(newColor) && chroma.valid(newColor)) {
        colors.push(newColor); // Ajouter la couleur valide à la palette
      }
    }
  
    setColorPairs(colors); // Mettre à jour la palette de couleurs avec 6 couleurs différentes
  };


  const handleColorChange = (color: string) => {
    setBaseColor(color);
    generateColors(color);
  };

  const handleReload = () => {
    generateColors(baseColor);
  };

  const handleGeneratePalette = () => {
    const left = 5;
    const top = 5;

    addElementAtPoint({
      type: "shape",
      width: 30,
      height: 30,
      left,
      top,
      viewBox: {
        width: 100,
        height: 100,
        top: 0,
        left: 0,
      },
      paths: [
        {
          d: "M 0 0 H 100 V 100 H 0 Z",
          fill: {
            dropTarget: false,
            color: baseColor,
          },
        },
      ],
      rotation: 0,
    });

    colorPairs.forEach((color, index) => {
      addElementAtPoint({
        type: "shape",
        width: 30,
        height: 30,
        left,
        top: top + (index + 1) * 40,
        viewBox: {
          width: 100,
          height: 100,
          top: 0,
          left: 0,
        },
        paths: [
          {
            d: "M 0 0 H 100 V 100 H 0 Z",
            fill: {
              dropTarget: false,
              color,
            },
          },
        ],
        rotation: 0,
      });
    });
  };

  const handleCopyPrimary = (index: number) => {
    navigator.clipboard.writeText(baseColor);
    setCopiedPrimaryIndex(index);
    setTimeout(() => setCopiedPrimaryIndex(null), 2000);
  };

  const handleCopySecondary = (index: number, color: string) => {
    navigator.clipboard.writeText(color);
    setCopiedSecondaryIndex(index);
    setTimeout(() => setCopiedSecondaryIndex(null), 2000);
  };

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="2u">
        <Text>
          {formatMessage({
            id: "description",
            defaultMessage:
              "Choose a base color to automatically generate complementary harmonious shades.",
          })}
        </Text>

        <FormField
          label={formatMessage({
            id: "baseColorLabel",
            defaultMessage: "Base color (primary)",
          })}
          control={() => (
            <ColorSelector color={baseColor} onChange={handleColorChange} />
          )}
        />

        <Button onClick={handleReload} icon={ReloadIcon} variant="secondary">
          {formatMessage({ id: "reload", defaultMessage: "Reload Palettes" })}
        </Button>

        <Button onClick={handleGeneratePalette} variant="primary">
          {formatMessage({
            id: "generatePalette",
            defaultMessage: "Add palettes to design",
          })}
        </Button>

        <Title size="small">
          {formatMessage({
            id: "generatedColorLabel",
            defaultMessage: "Generated color duos",
          })}
        </Title>

        {colorPairs.map((generatedColor, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              gap: "1rem",
              alignItems: "flex-start",
              justifyContent: "space-between",
              marginBottom: "20px",
            }}
          >
            {/* Primary Color */}
            <div style={{ flex: 1 }}>
              <div
                style={{
                  height: "80px",
                  backgroundColor: baseColor,
                  borderRadius: "8px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <Text alignment="center">{baseColor}</Text>
              </div>
              <Button
                variant="secondary"
                onClick={() => handleCopyPrimary(index)}
                stretch
              >
                {copiedPrimaryIndex === index
                  ? formatMessage({
                      id: "colorCopied",
                      defaultMessage: "Copied!",
                    })
                  : formatMessage({ id: "copy", defaultMessage: "Copy" })}
              </Button>
            </div>

            {/* Generated Color */}
            <div style={{ flex: 1 }}>
              <div
                style={{
                  height: "80px",
                  backgroundColor: generatedColor,
                  borderRadius: "8px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <Text alignment="center">{generatedColor}</Text>
              </div>
              <Button
                variant="secondary"
                onClick={() => handleCopySecondary(index, generatedColor)}
                stretch
              >
                {copiedSecondaryIndex === index
                  ? formatMessage({
                      id: "colorCopied",
                      defaultMessage: "Copied",
                    })
                  : formatMessage({ id: "copy", defaultMessage: "Copy" })}
              </Button>
            </div>
          </div>
        ))}
      </Rows>
    </div>
  );
};
