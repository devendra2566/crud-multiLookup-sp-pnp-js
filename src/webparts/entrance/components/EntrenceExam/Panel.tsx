import * as React from 'react';
import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';
import { Panel } from '@fluentui/react/lib/Panel';
import { useBoolean } from '@fluentui/react-hooks';
import { Web } from "sp-pnp-js";
const buttonStyles = { root: { marginRight: 8 } };

export const PanelFooterExample = (props:any) => {
  const [isOpen, { setTrue: openPanel, setFalse: dismissPanel }] = useBoolean(false);
  const[input , setInput]=React.useState<any>({
    Title:"",
    Exams:[],
    Age:"",
    Education:"",
    location:"",
    ExamDate:""
  })
  const[data,  setData]=React.useState([])
  // This panel doesn't actually save anything; the buttons are just an example of what
  // someone might want to render in a panel footer.
  const onRenderFooterContent = 
    () => (
      <div>
        <PrimaryButton onClick={dismissPanel} styles={buttonStyles}>
          Save
        </PrimaryButton>
        <DefaultButton onClick={dismissPanel}>Cancel</DefaultButton>
      </div>
    
    )

  React.useEffect(()=>{
try{
     setInput({
      Title:props?.item?.Title,
      Exams:props?.item?.Exams,
      Age:props?.item?.Age,
      Education:props?.item?.Education,
      location:props?.item?.location,
      ExamDate:props?.item?.ExamDate?.Date
    })}catch(error){console.log(error)}

  },[props?.item])

function handleChange(e:any){
  const { name, value, type, selectedOptions } = e.target;
  
  if (type === 'select-multiple') {
    const selectedValues = Array.from(selectedOptions).map((option: any) => option.value);
    console.log(selectedValues)
    setInput({ ...input, [name]: selectedValues });
  } else {
    setInput({...input, [name]: value });
  }
  console.log(input);
}

async function getData(){
        
        const web =new Web("https://smalsusinfolabs.sharepoint.com/sites/Portal/DevSharma")
        const res=await web.lists.getById('9a24d71d-ae98-4314-99be-f945ccfbb57b').items.select('Id','Title','Date').get()
        setData(res)
        
}
React.useEffect(()=>{
getData()
},[])

async function postData(e: any) {
  e.preventDefault();
  let web = new Web(
    "https://smalsusinfolabs.sharepoint.com/sites/Portal/DevSharma"
  );
  await web.lists.getById("8b0c548e-8193-44a8-a65e-8822123800e1").items.add({
    
      Title:input.Title,
      ExamsId:{results:input.Exams.map((examId:any) => parseInt(examId))},
      Age:input.Age,
      Education:input.Education,
      location:input.location,
      ExamDateId:input.ExamDate
    
  });

  props.fetchData();
}



   async function updateFunction(e:any){
    e.preventDefault();
    let web = new Web(
      "https://smalsusinfolabs.sharepoint.com/sites/Portal/DevSharma"
    );
    await web.lists
      .getById("8b0c548e-8193-44a8-a65e-8822123800e1")
      .items.getById(props.item.Id)
      .update({
    
        Title:input?.Title,
        ExamsId:{results:input?.Exams?.map((examId:any) => parseInt(examId))},
        Age:input?.Age,
        Education:input?.Education,
        location:input?.location,
        ExamDateId:input.ExamDate
      
    });
              props.fetchData();
   }



  return (
    <div>
      <DefaultButton text="Open panel" onClick={openPanel} />
      <Panel
        isOpen={isOpen}
        onDismiss={dismissPanel}
        headerText="Panel with footer at bottom"
        closeButtonAriaLabel="Close"
        onRenderFooterContent={onRenderFooterContent}
        // Stretch panel content to fill the available height so the footer is positioned
        // at the bottom of the page
        isFooterAtBottom={true}
      >
        <div onChange={handleChange}>
            <form> 
                <div>Name</div>
                <input type='text' name='Title' value={input.Title}></input>
                <div>Exams</div>
                <select name='Exams'  id="companyDropdown"
              className="form-select" multiple>
                  {
                    data?.map((item:any)=>(
                      <option key={item?.Id} value={item?.Id}>{item?.Title}</option>
                    ))
                  }
                </select>
                <div>Age</div>
                <input type='text' name='Age' value={input.Age}></input>
                <div>Education</div>
                <input type='text' name='Education' value={input.Education}></input>
                <div>Location</div>
                <input type='text' name='location' value={input.location}></input>
                <div>ExamDate</div>
                <select name='ExamDate'  id="companyDropdown"
              className="form-select">
                  {
                      data?.map((item:any)=>(
                        <option  key={item?.Id} value={item?.Id}>{item?.Date}</option>
                      ))
                  
                  }
                  
                </select>
                <button onClick={postData}>Add</button>
                <button onClick={updateFunction}>update</button>
            </form>
        </div>
      </Panel>
    </div>
  );
};
