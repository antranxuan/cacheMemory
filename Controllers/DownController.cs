//using DocPro.Customs.Factories;
using DocproPVEP.Customs.Utility;
using DocProUtil;
using DocProUtil.Attributes;
using DocProUtil.Cf;
using System.IO;
using System.Web.Mvc;

namespace DocproPVEP.Controllers
{
    [AclLicense]
    [AclAuthorize]
    public class DownController : BaseController
    {
        public string FileName;
        public ActionResult Index(string id, string fileName = null)
        {
            Loger.Log(fileName, "filename");
            string filePath = Utils.Base64Decode(id);
            FileName = GlobalConfig.StgPath(filePath);
            Loger.Log(FileName, "fileName");
            if (Utils.IsFileExists(FileName))
            {
                return Utils.AccessNAS<FileContentResult>(FileName, () =>
                {
                    var fileNameDown = fileName;


                var fileInfo = new FileInfo(FileName);
                if (string.IsNullOrEmpty(fileName))
                {
                    fileNameDown = string.Format("{0}{1}",
                        fileInfo.Name.TrimEnd(fileInfo.Extension, true),
                        fileInfo.Extension);
                }
                return File(System.IO.File.ReadAllBytes(FileName), Utils.GetContentType(fileInfo.Extension), fileNameDown);
                });
            }
            SetWarn(Locate.T("File tải về không tìm thấy"));
            return GetResultOrReferrerDefault("/home.html");
        }
    }
}