using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using DocProLogic.Customs.Exceptions;

using DocproPVEP.Customs.Params;
using DocproPVEP.Models.DATA;
using DocproPVEP.Models.View;
using DocproPVEP.Repository;
using DocProUtil;
using DocProUtil.Attributes;
namespace DocproPVEP.Controllers
{
    public class DanhSachDuAnController : BaseController
    {
        private string defaultPath = "/DanhSachDuAn.html";
        // GET: ThongTinChung
        public ActionResult Index()
        {
            SetTitle(Locate.T("Danh sách dự án"));
            return View();
        }
    }
}