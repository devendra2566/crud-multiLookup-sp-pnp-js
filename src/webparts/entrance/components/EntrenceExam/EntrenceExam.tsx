import React, { useEffect, useState } from "react";
import { Web } from "sp-pnp-js";
import { PanelFooterExample } from "./Panel";

const EntrenceExam = () => {
  const [data, setData] = useState<any[]>([]);

  async function fetchData() {
    try {
      const getData = new Web(
        "https://smalsusinfolabs.sharepoint.com/sites/Portal/DevSharma"
      );
      const res = await getData.lists
        .getById("8b0c548e-8193-44a8-a65e-8822123800e1")
        .items.select(
          "Id",
          "Title",
          "Exams/Title",
          "Age",
          "Education",
          "location",
          "ExamDate/Date"
        )
        .expand("Exams", "ExamDate")
        .get();
    //   res.map((item: any) => {
    //     item.Exams?.map((item2: any) => {
    //       console.log(item2.Title);
    //     });
    //   });
      setData(res);
      console.log("res...", res);
    } catch (error) {
      console.error(error, "error of fetch Data");
    }
  }

  useEffect(() => {
    fetchData();
  }, []);
  
 async function removeData(id:any){
    const web=new Web("https://smalsusinfolabs.sharepoint.com/sites/Portal/DevSharma")
         await  web.lists.getById("8b0c548e-8193-44a8-a65e-8822123800e1").items.getById(id).delete()
           fetchData()
  }


  return (
    <div>
      <PanelFooterExample    fetchData={fetchData}>Add</PanelFooterExample>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Exams</th>
            <th>Age</th>
            <th>Education</th>
            <th>Location</th>
            <th>ExamDate</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((item) => (
            <tr key={item?.Id}>
              <td>{item?.Id}</td>
              <td>{item?.Title}</td>
             <td> {item?.Exams?.map((item2:any,index:any)=>(
               <span>{item2.Title},</span>
              ))}</td>
              <td>{item?.Age}</td>
              <td>{item?.Education}</td>
              <td>{item?.location}</td>
              <td>{item?.ExamDate?.Date}</td>
              <button onClick={()=>removeData(item.Id)}>deletee</button>
              <PanelFooterExample item={item} fetchData={fetchData}>Update</PanelFooterExample>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EntrenceExam;
