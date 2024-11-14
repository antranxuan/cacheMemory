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
    public class DmNhaThauController : BaseController
    {
        private string defaultPath = "/DmNhaThau.html";
        // GET: DmNhaThau
        public ActionResult Index()
        {
            SetTitle(Locate.T("Danh mục nhà thầu"));
            var searchParam = Utils.Bind<SearchParam>(DATA);
            ViewBag.SearchParam = searchParam;

            var datas = DmNhaThauRepository.Search(CUser.IDChannel, searchParam, Paging).ToList() ?? new List<DmNhaThau>();
            return GetCustResultOrView(new ViewParam()
            {
                ViewName = "Index",
                ViewNameAjax = "DmNhaThaus",
                Data = new DmNhaThauModel
                {
                    ActionLinkSearch = Locate.Url(defaultPath),
                    DmNhaThaus = datas ?? new List<DmNhaThau>(),
                }
            });
        }

        #region Insert
        public ActionResult Create()
        {
            SetTitle(Locate.T("Tạo mới danh mục"));
            return GetDialogResultOrView("Create", 600, new DmNhaThauModel
            {
                Url = Locate.Url("/DmNhaThau/save.html"),
                DmNhaThau = new DmNhaThau(),
                Action = 1,
            }); ;
        }

        public ActionResult Save()
        {
            var dmNhaThau = Utils.BindCreatedBy<DmNhaThau>(DATA, CUser.ID);

            dmNhaThau.IDChannel = CUser.IDChannel;
            if (!IsValidate(dmNhaThau))
                return GetResultOrRedirectDefault(defaultPath);
            if (DmNhaThauRepository.Instance.Insert(dmNhaThau))
                SetSuccess(Locate.T("Thêm mới nhà thầu thành công"));
            else
                SetError(Locate.T("Xảy ra lỗi trong quá trình thêm nhà thầu"));
            return GetResultOrRedirectDefault(defaultPath);
        }
        private bool IsValidate(DmNhaThau dmNhaThau)
        {
            if (string.IsNullOrEmpty(dmNhaThau.MaNhaThau))
            {
                SetError(Locate.T("Mã nhà thầu được để trống"));
            }
            else
            if (DmNhaThauRepository.CheckCode(CUser.IDChannel, dmNhaThau.MaNhaThau, dmNhaThau.ID))
            {
                SetError(Locate.T("Mã nhà thầu đã tồn tại"));
            }
            else if (string.IsNullOrEmpty(dmNhaThau.TenNhaThau))
            {
                SetError(Locate.T("Tên nhà thầu không được để trống"));
            }
            return !HasError;
        }
        #endregion
        #region Update
        public ActionResult Update(int id)
        {
            SetTitle(Locate.T("Cập nhật thông tin danh mục nhà thầu"));
            try
            {
                return GetDialogResultOrView("Create", 600, new DmNhaThauModel
                {
                    Url = Locate.Url("/DmNhaThau/change.html"),
                    DmNhaThau = DmNhaThauRepository.Instance.GetById(id) ?? new DmNhaThau(),
                    Action = 1,
                }); ;
            }
            catch (BusinessLogicException ex)
            {
                SetError(Locate.T(ex.Message));
            }
            return GetResultOrRedirectDefault(Locate.Url(defaultPath));
        }

        public ActionResult Change()
        {
            var item = DmNhaThauRepository.Instance.GetById(Utils.GetInt(DATA, "ID"));
            var dmNhaThau = Utils.BindUpdatedBy<DmNhaThau>(item, DATA, CUser.ID);
            if (!IsValidate(dmNhaThau))
                return GetResultOrRedirectDefault(defaultPath);
            if (DmNhaThauRepository.Instance.Update(dmNhaThau))
                SetSuccess(Locate.T("Cập nhật nhà thầu thành công"));
            else
                SetError(Locate.T("Xảy ra lỗi trong quá trình cập nhật"));
            return GetResultOrRedirectDefault(defaultPath);
        }
        #endregion
        #region Delete
        public ActionResult IsDelete(DeleteParam deleteParam)
        {
            var item = DmNhaThauRepository.Instance.GetById((int)deleteParam.ID);
            if (Equals(item, null))
            {
                SetWarn(Locate.T("Danh mục nhà thầu không tồn tại"));
                return GetResultOrRedirectDefault(defaultPath);
            }
            return GetDialogResultOrViewDelete(new DeleteParam
            {
                ID = item.ID,
                RedirectPath = GetRedirectOrDefault(defaultPath),
                Action = Locate.Url("/DmNhaThau/delete.html"),
                BackTitle = Locate.T("Quay lại danh mục nhà thầu"),
                ConfTitle = Locate.T("Xóa nhà thầu"),
                Title = Locate.T("Xác nhận xóa thông tin nhà thầu")
            });
        }
        public ActionResult Delete(DeleteParam deleteParam)
        {
            var dmNhaThau = DmNhaThauRepository.Instance.GetById((int)deleteParam.ID);
            if (Utils.IsEmpty(dmNhaThau))
            {
                SetError(Locate.T("Danh mục nhà thầu không tồn tại"));
            }
            else if (DmNhaThauRepository.Instance.Delete(dmNhaThau))
                SetSuccess(Locate.T("Xóa danh mục nhà thầu thành công"));
            else
                SetError(Locate.T("Lỗi: Xóa nhà thầu không thành công"));
            return GetResultOrRedirectDefault(defaultPath);
        }
        #endregion

    }
}