import React from "react";
import ModalDialog from "../ModalDialog"
import GenericInput from "../GenericInput";
import { CircularProgress, Radio, RadioGroup } from "@nextui-org/react";
import { isStateError, isStateLoading, isStateSuccess, UiState, UiStateType } from "../../communication/UiState";
import StateMessage from "../StateMessage";
import SelectionField from "../Controls/SelectionField";
import { WineColor } from "../../model/Domain/WineColor";

type Props = { 
  isOpen: boolean,
  onOpenChange: () => void,
  autoLabelSamples?: (prefix: string, orderType: string, colorOrder: string[]) => Promise<void>
}

enum OrderTypeOptions {
  BY_WINERY = "byWinery",
  BY_GRAPE = "byGrape",
  BY_GRAPE_COLOR = "byGrapeColor"
}

const colorOptions = {
  RED: { 
    value: WineColor.RED, 
    label: "Red", 
    startContent:<div className="w-3 h-3 bg-redWineColor rounded-full" />
  },
  WHITE: { 
    value: "white", 
    label: "White",
    startContent:<div className="w-3 h-3 bg-whiteWineColor rounded-full" />
  },
  ROSE: { 
    value: "rose", 
    label: "Rose",
    startContent:<div className="w-3 h-3 bg-roseWineColor rounded-full" />
  },
}

const additionalOrderOptions = {
  BY_RATING: { value: "byRating", label: "By Rating" },
  BY_YEAR: { value: "byYear", label: "By Year" }
};

const AutoLabelModal = ({ isOpen, onOpenChange, autoLabelSamples }: Props) => {
  // Auto labeling
  const [prefixValue, setPrefixValue] = React.useState<string>("");
  const [orderType, setOrderType] = React.useState<string>(OrderTypeOptions.BY_WINERY);
  const [colorSelection, setColorSelection] = React.useState<string[]>(
    [colorOptions.RED.value, colorOptions.WHITE.value, colorOptions.ROSE.value]
  );

  const [uiState, setUiState] = React.useState<UiState>({ type: UiStateType.IDLE });

  const onCofirmAction = async () => {
    let validation = true;
    Object.values(colorOptions).forEach((color) => {
      if (!colorSelection.includes(color.value)) {
        validation = false;
      }
    });
    if (validation && autoLabelSamples) {
      setUiState({ type: UiStateType.LOADING });
      await autoLabelSamples(prefixValue, orderType, colorSelection)
      setUiState({ type: UiStateType.SUCCESS });
    } else {
      setUiState({ type: UiStateType.ERROR, message: "Please select all colors" });
    }
  }

  return (
    <ModalDialog
      header="Auto Labeling"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onConfirm={onCofirmAction}
      onCloseAction={() => setUiState({ type: UiStateType.IDLE })}
      size="lg"
    >
      {isStateLoading(uiState) && <>
        <CircularProgress color="primary" className="m-auto" />
      </>}
      
      {!isStateLoading(uiState) && 
      <>
        <GenericInput 
          label="Prefix"
          placeholder="None"
          value={prefixValue}
          onChange={setPrefixValue}
        />

        <RadioGroup
          label="Select labeling grouping method"
          orientation="horizontal"
          value={orderType}
          onValueChange={setOrderType}
          defaultValue={orderType}
        >
          <Radio value={OrderTypeOptions.BY_WINERY}>By Winery</Radio>
          <Radio value={OrderTypeOptions.BY_GRAPE}>By Grape</Radio>
          <Radio value={OrderTypeOptions.BY_GRAPE_COLOR}>By Grape Color</Radio>
        </RadioGroup>

        {orderType == OrderTypeOptions.BY_WINERY && (
          <p>TODO</p>
        )}

        {orderType == OrderTypeOptions.BY_GRAPE_COLOR && (
          Object.values(colorOptions).map((color, index) => (
            <div className="flex flex-row items-center gap-4"> 
              <h3>{index + 1}.</h3>
              <SelectionField 
                key={index}
                label="Select an color"
                defaultSelectedKeys={[color.value]}
                onSelectionChange={(e) => {
                  const newSelection = [...colorSelection]
                  newSelection[index] = e.target.value
                  setColorSelection(newSelection)
                }}
                items={Object.values(colorOptions)}
              />
            </div>
          ))
        )}

        {isStateSuccess(uiState) && 
          <StateMessage 
            stateMessageType="success"
            text={<p>Samples <b>successfully</b> labeled</p>}
          />
        }

        {isStateError(uiState) &&
          <StateMessage
            stateMessageType="error"
            text={<p>{uiState.message}</p>}
          />
        }
      </>
    }
    </ModalDialog>
  )
}

export default AutoLabelModal