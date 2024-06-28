import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { handleTooltipRender } from "./SliderTooltip";
import { StyledFormSliderInput } from "./styles";

type FormSliderInputProps = {
  onChange: (value: number) => void;
  defaultValue?: number;
};

export const FormSliderInput = ({ defaultValue = 0, onChange }: FormSliderInputProps) => {
  return (
    <StyledFormSliderInput>
      <Slider
        onChange={onChange as any}
        defaultValue={defaultValue}
        step={1}
        marks={{
          0: {
            label: (
              <div className="mark">
                <div className="line" />
                <p>0%</p>
              </div>
            ),
          },
          25: {
            label: (
              <div className="mark">
                <div className="line" />
              </div>
            ),
          },
          50: {
            label: (
              <div className="mark">
                <div className="line" />
                <p>50%</p>
              </div>
            ),
          },
          75: {
            label: (
              <div className="mark">
                <div className="line" />
              </div>
            ),
          },
          100: {
            label: (
              <div className="mark">
                <div className="line" />
                <p>100%</p>
              </div>
            ),
          },
        }}
        handleRender={handleTooltipRender}
        styles={{
          track: { backgroundColor: "#24E8C5", height: 8 },
          rail: { backgroundColor: "#383A62", height: 8 },
          handle: { backgroundColor: "#24E8C5", height: 26, width: 26, border: "4px solid #383A62", top: 0, opacity: 1 },
        }}
        dotStyle={{ display: "none" }}
      />
    </StyledFormSliderInput>
  );
};
