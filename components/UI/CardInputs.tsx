import { TextField } from "@mui/material";
import { useState } from "react";
import MyButton from "./MyButton";
import MyCard from "./MyCard";
import { LinearProgressWithLabel } from "./Progress";
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';


export interface MyFormData extends Array<MyFieldData>{}

export interface MyProgressI{
    progress?: number
    message?: string
}

interface MyFieldData {
    id: any
    data: string
}

export enum MyFieldType {
    DATE_TIME_PICKER = 'date-time-picker',
    TEXT_FIELD = 'text-field'
}

interface MyField{
    title?: string
    label?: string
    type?: MyFieldType
}

interface CardInputsProps{
    title?: string
    buttonText?: string
    fields?: Array<MyField>
    onSubmit?(formData: MyFormData): void
    progress?: MyProgressI,
    fullWidth?: boolean,
    i18n?: any
}

const CardInputs = (props: CardInputsProps) => {

    // -- (states)
    const [formData, setFormData] = useState<MyFormData>([]);
    const [formDate, setFormDate] = useState<any>(null);

    // -- (declaration)
    const title = props.title ?? '- TITLE -';
    const buttonText = props.buttonText ?? '- MINT -';
    const fields = props?.fields ?? [];

    // -- (event) on button clicked
    const onClick = async (e: any) => {
        console.log("[onClick]formData:", JSON.stringify(formData));
        
        if(props?.onSubmit){
            props.onSubmit(formData);
        }
    }

    // -- (event) on text change
    const handleChange = (d: any, index: number) => {
        console.log("[handleChange] index:", index)

        const data : MyFormData = [...formData];

        data[index] = {
            id: fields[index]?.title,
            data: d,
        };

        setFormData(data);

    }

    // -- (render) date time picker field
    const renderDateTimePicker = (field: any, id: any) => {
        return (
            <div key={id} className="mt-24">
                <LocalizationProvider dateAdapter={AdapterMoment}>
                <DateTimePicker
                    renderInput={(props) => <TextField {...props} />}
                    label="DateTimePicker"
                    value={formDate}
                    onChange={(newValue) => {
                        handleChange(newValue, id)
                        setFormDate(newValue);
                    }}
                />
                </LocalizationProvider>
            </div>
        )
    }

    // -- (render) render text field
    const renderTextField = (field: any, id: any) => {
        return (
            <div key={id} className="mb-12">
                
                <div>{ field.title }</div>
                
                <TextField
                    className="mt-8"
                    label={field.label}
                    defaultValue=""
                    size="small"
                    fullWidth={true}
                    onChange={(e) => handleChange(e.target.value, id)}
                />
            </div>
        )
    }

    // -- (render) render all fields
    const renderFields = () => {
        return (
            <>
                <div className="my-fields">
                    { fields?.map((field, i) => {

                        if(field.type == MyFieldType.DATE_TIME_PICKER){
                            return renderDateTimePicker(field, i);
                        }else{
                            return renderTextField(field, i);
                        }
                        
                    }) }
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
    
    // -- (render) submit button
    const renderButton = () => {
        return <MyButton onClick={onClick} fullWidth={props.fullWidth}>{ buttonText }</MyButton>;
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
                {
                    props.fullWidth ? 
                    renderButton() :
                    <div className='ml-auto flex'>
                        { renderButton() }
                    </div>
                }
            </div>
          </MyCard>
        </>
      )
}

export default CardInputs;