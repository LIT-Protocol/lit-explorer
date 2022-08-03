import { TextField } from "@mui/material";
import { useState } from "react";
import MyButton from "./MyButton";
import MyCard from "./MyCard";

interface FormData extends Array<MyFieldData>{}

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
    onSubmit?(formData: FormData): void
}

const CardInputs = (props: CardInputsProps) => {

    // -- (states)
    const [formData, setFormData] = useState<FormData>([]);

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

        const data : FormData = [...formData];

        data[index] = {
            id: index,
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

    return (
        <>
          <MyCard title={title}>
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