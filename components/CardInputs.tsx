import { TextField } from "@mui/material";
import { useState } from "react";
import MyButton from "./MyButton";
import MyCard from "./MyCard";
import { LinearProgressWithLabel } from "./Progress";

export interface MyFormData extends Array<MyFieldData>{}

export interface MyProgress{
    progress?: number
    message?: string
}

interface MyFieldData {
    id: any
    data: string
}

interface MyField{
    title?: string
    label?: string
}

interface CardInputsProps{
    title?: string
    buttonText?: string
    fields?: Array<MyField>
    onSubmit?(formData: MyFormData): void
    progress?: MyProgress
}

const CardInputs = (props: CardInputsProps) => {

    // -- (states)
    const [formData, setFormData] = useState<MyFormData>([]);

    // -- (declaration)
    const title = props.title ?? 'Mint New PKP';
    const buttonText = props.buttonText ?? 'MINT';
    const fields = props?.fields ?? [];

    // -- (event) on button clicked
    const onClick = async (e: any) => {
        console.log("[onClick]formData:", JSON.stringify(formData));
        
        if(props?.onSubmit){
            props.onSubmit(formData);
        }
    }

    // -- (event) on text change
    const handleChange = (e: any, index: number) => {
        console.log("[handleChange] index:", index)

        const data : MyFormData = [...formData];

        data[index] = {
            id: fields[index]?.title,
            data: e.target.value,
        };

        setFormData(data);

    }

    // -- (render) render single field
    const renderField = (field: any, id: any) => {
        return (
            <div key={id} className="mb-12">
                <div>{ field.title }</div>
                <TextField
                    className="mt-8"
                    label={field.label}
                    defaultValue=""
                    size="small"
                    fullWidth={true}
                    onChange={(e) => handleChange(e, id)}
                />
            </div>
        )
    }

    // -- (render) render all fields
    const renderFields = () => {
        return (
            <>
                <div className="my-fields">
                    { fields?.map((field, i) => renderField(field, i)) }
                </div>
            </>
        )
    }

    // -- (render) render progress
    const renderProgress = () => {

        const progress = props?.progress?.progress ?? 0;

        if(progress > 0){
            return (
                <>
                    <LinearProgressWithLabel value={progress || 0} />
                    { props.progress?.message }
                </>
            )
        }else{
            return '';
        }
    }

    return (
        <>
          <MyCard title={title}>
            <div className="mt-12 mb-12">                
                { renderProgress() }
            </div>
            <div className="flex">
                { renderFields()}
            </div>
            <div className="mt-12 flex">
                <div className="ml-auto">
                    <MyButton onClick={onClick}>{ buttonText }</MyButton>
                </div>
            </div>
          </MyCard>
        </>
      )
}

export default CardInputs;