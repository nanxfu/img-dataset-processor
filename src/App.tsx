import {
  Layout,
} from "antd";
import "./App.css";
import ToolSidebar from "./features/ToolBar/ToolSidebar";
import EditorLayout from "./features/EditorSpace/EditorSpace";

// const oldVersion = function () {
//   const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);
//   const [images, setImages] = useState<ImageItem[]>([]);
//   const handleFileUpload = (info: UploadChangeParam) => {
//     if (info.file && info.file.status !== "uploading") {
//       const file = info.file.originFileObj as RcFile;
//       const newImage = {
//         id: Math.random().toString(36).substring(7),
//         url: URL.createObjectURL(file),
//         name: file.name,
//       };
//       setImages([...images, newImage]);
//       setSelectedImage(newImage);
//     }
//   };

//   const handleSelectImages = () => {
//     console.log("选择图片功能");
//   };
//   return (
//     <Layout style={{ minHeight: "100vh" }}>
//       <Header style={{ padding: "0 24px" }}>
//         <div style={{ display: "flex", alignItems: "center" }}>
//           <PictureOutlined style={{ fontSize: "24px", marginRight: "12px" }} />
//           <AppTitle level={3} style={{ margin: "0" }}>
//             LoRA 数据集处理器
//           </AppTitle>
//         </div>
//       </Header>
//       <Layout>
//         {/* 左侧边栏 - 图片列表 */}
//         <Sider
//           width={150}
//           theme="light"
//           style={{
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             backgroundColor: "#000000",
//           }}
//         >
//           <div style={{ padding: "16px" }}>
            // <Upload
            //   accept="image/*"
            //   multiple
            //   showUploadList={false}
            //   customRequest={({ onSuccess }) => {
            //     setTimeout(() => {
            //       onSuccess?.(null);
            //     }, 0);
            //   }}
            //   onChange={handleFileUpload}
            // >
            //   <Button icon={<FolderOpenOutlined />} block type="primary">
            //     导入图片
            //   </Button>
            // </Upload>
//             <div>
//               <div style={{ padding: "16px" }}>
//                 <ActionButton
//                   icon={<SelectOutlined />}
//                   text="Crop"
//                   onClick={handleSelectImages}
//                 />
//               </div>

//               <div style={{ padding: "16px" }}>
//                 <ActionButton
//                   icon={<CheckSquareOutlined />}
//                   text="Crop"
//                   onClick={handleSelectImages}
//                 />
//               </div>
//             </div>
//           </div>
//         </Sider>

//         {/* 主内容 - 图片预览 */}
//         <Content
//           style={{
//             padding: "16px",
//             display: "flex",
//           }}
//         >
//           <Card
//             variant="borderless"
//             style={{
//               display: "flex",
//               flexDirection: "column",
//               alignItems: "center",
//               flex: 1,
//             }}
//             className="img-preview-card"
//           >
//             {selectedImage ? (
//               <>
//                 <div style={{ padding: "12px" }}>
//                   <AppTitle level={4} style={{ margin: 0 }}>
//                     {selectedImage.name}
//                   </AppTitle>
//                 </div>
//                 <div
//                   style={{
//                     padding: "24px",
//                     textAlign: "center",
//                     flex: 1,
//                     overflow: "auto",
//                     display: "flex",
//                     justifyContent: "center",
//                     alignItems: "center",
//                   }}
//                 >
//                   <div
//                     style={{
//                       height: "100%",
//                       width: "100%",
//                       position: "relative",
//                     }}
//                   >
//                     <img
//                       src={selectedImage.url}
//                       alt={selectedImage.name}
//                       style={{
//                         width: "100%",
//                         height: "100%",
//                         objectFit: "contain",
//                         position: "absolute",
//                         top: 0,
//                         left: 0,
//                       }}
//                     />
//                   </div>
//                 </div>
//               </>
//             ) : (
//               <Empty
//                 image={<UploadOutlined style={{ fontSize: "64px" }} />}
//                 description="选择一张图片进行预览"
//                 style={{ margin: "auto", padding: "48px 0" }}
//               />
//             )}
//           </Card>
//         </Content>

//         {/* 右侧边栏 - 图片操作 */}
//         <Sider width={280} theme="light">
//           <div style={{ padding: "16px" }}>
//             <div style={{ display: "flex", alignItems: "center" }}>
//               <SettingOutlined
//                 style={{ fontSize: "18px", marginRight: "8px" }}
//               />
//               <AppTitle level={4} style={{ margin: 0 }}>
//                 图片操作
//               </AppTitle>
//             </div>
//           </div>
//           <div style={{ padding: "16px" }}>
//             {selectedImage ? (
//               <div
//                 style={{
//                   display: "flex",
//                   flexDirection: "column",
//                   gap: "16px",
//                 }}
//               >
//                 <div>
//                   <Typography.Text
//                     strong
//                     style={{ display: "block", marginBottom: "8px" }}
//                   >
//                     调整大小
//                   </Typography.Text>
//                   <Select defaultValue="512x512" style={{ width: "100%" }}>
//                     <Option value="512x512">512 x 512</Option>
//                     <Option value="768x768">768 x 768</Option>
//                     <Option value="1024x1024">1024 x 1024</Option>
//                   </Select>
//                 </div>
//                 <div>
//                   <Typography.Text
//                     strong
//                     style={{ display: "block", marginBottom: "8px" }}
//                   >
//                     质量
//                   </Typography.Text>
//                   <Slider defaultValue={90} />
//                 </div>
//                 <Button type="primary" block>
//                   处理图片
//                 </Button>
//               </div>
//             ) : (
//               <Empty
//                 description="选择一张图片显示操作选项"
//                 style={{ margin: "auto" }}
//               />
//             )}
//           </div>
//         </Sider>
//       </Layout>
//     </Layout>
//   );
// };
function App() {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <ToolSidebar />
      <EditorLayout />
    </Layout>
  );
}

export default App;
