using DocProUtil;
using System.Web.Mvc;

namespace DocproPVEP.Controllers
{
    public class ErrorController : BaseController
    {
        public ActionResult AccessDenied()
        {
            SetTitle(Locate.T("Giới hạn truy cập"));
            return View("AccessDenied");
        }
        public ActionResult Page404()
        {
            SetTitle("Lỗi không tìm thấy trang ");

            IncludeCss(Locate.T("~/Assets/app/css/404.css"));
            return GetCustResultOrView("Page404");
        }
        public ActionResult Page500()
        {
            SetTitle(Locate.T("Lỗi hệ thống xin vui lòng liên hệ quản trị để được trợ giúp"));

            IncludeCss("~/Assets/app/css/500.css");
            return GetCustResultOrView("Page500");
        }

    }
}