using DocproPVEP.Customs.Charts;
using DocproPVEP.Customs.Entities;
using DocproPVEP.Customs.Enum;
using DocproPVEP.Customs.Params;
using DocproPVEP.Customs.Utility;
using DocProLogic.Customs.Builders;
using DocProModel.Customs.Params;
using DocProModel.Models;
using DocProModel.Repository;
using DocProUtil;
using DocProUtil.Attributes;
using DocProUtil.Cf;
using DocProUtil.Customs.Perms;
using Newtonsoft.Json;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Web.Mvc;
namespace DocproPVEP.Controllers
{
    [AclAuthorize]
    public class HomeController : BaseController
    {
        //[AclAuthorizeModule(IsView = true, Modules = new int[] {
        //     (int)IModule.BaoCaoDuAn ,(int)IModule.BaoCaoHopTacQuocTe 
        // })]
        public ActionResult Index()
        {
            return GetCustResultOrView(new ViewParam
            {
                Data = null,
                ViewName = "Index",
                ViewNameAjax = "Index",
            });
        }
    }
}
