using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using DocProLogic.Customs.Exceptions;
using DocProModel.Models;
using DocProModel.Repository;
using DocproPVEP.Customs.Params;
using DocproPVEP.Models.View;
using DocproPVEP.Repository;
using DocProUtil;
using DocProUtil.Attributes;

namespace DocproPVEP.Controllers
{
    [AclAuthorize]
    public class LioneDemoController : BaseController
    {
        private string defaultPath = "/Lione-Demo.html";
        // GET: LioneDemo
        public ActionResult Index()
        {
            SetTitle(Locate.T("Danh sách danh mục"));
            var searchParam = Utils.Bind<SearchParam>(DATA);
            ViewBag.SearchParam = searchParam;
           
            var datas = CategoryCusRepository.AllDanhMuc(CUser.IDChannel, searchParam, Paging).ToList() ?? new List<Category>();
            return GetCustResultOrView(new ViewParam()
            {
                ViewName = "Index",
                ViewNameAjax = "DanhSach",
                Data = new CategoryCusModel
                {
                    ActionLinkSearch = Locate.Url(defaultPath),
                    categories = datas ?? new List<Category>(),
                }
            });
        }
        #region Tạo mới
        public ActionResult Create()
        {
            SetTitle(Locate.T("Tạo mới danh mục"));
            var categorycha = CategoryRepository.Instance.GetByParent(CUser.IDChannel, 0);
            return GetDialogResultOrView("Create", 600, new CategoryCusModel
            {
                Url = Locate.Url("/Lione-Demo/save.html"),
                categorie = new Category(),
                categories= categorycha,
                Action = 1,
            });;
        }
        public ActionResult Save()
        {
            var _meetingRoom = Utils.BindCreatedBy<Category>(DATA, CUser.ID);
            _meetingRoom.IDChannel = CUser.IDChannel;
            _meetingRoom.CreatedBy = CUser.ID;
            _meetingRoom.Created =DateTime.Now;
            _meetingRoom.Type = 2334;
            _meetingRoom.Parents = "0";
            _meetingRoom.UpdatedBy = 0;
            _meetingRoom.ApprovedBy = 0;
            _meetingRoom.PublishedBy = 0;
            _meetingRoom.IDOrgan = 0;
            _meetingRoom.IsApproved = true;
            _meetingRoom.IsExpired = true;
            _meetingRoom.IsPublished = true;

            _meetingRoom.StartYear = 0;
            _meetingRoom.EndYear = 0;
            _meetingRoom.Total = 0;
            _meetingRoom.TotalRevised = 0;
            _meetingRoom.TotalUnRevised = 0;
            _meetingRoom.StartEntry = 0;
            _meetingRoom.EndEntry = 0;

            if (string.IsNullOrEmpty(_meetingRoom.Code))
            {
                SetError(Locate.T("Mã danh mục không được để trống"));
            }
            if (string.IsNullOrEmpty(_meetingRoom.Name))
            {
                SetError(Locate.T("Tên danh mục không được để trống"));
            }
            if (CategoryCusRepository.CheckCode(CUser.IDChannel, _meetingRoom.Code))
            {
                SetError(Locate.T("Mã danh mục này đã tồn tại"));
            }
           

            if (HasError)
            {
                return GetResultOrRedirectDefault(defaultPath);
            }
            if (CategoryCusRepository.Instance.Insert(_meetingRoom))
            {
                //Insert_UpdateThietBi(_meetingRoom.IDThietBis, _meetingRoom.ID);
                SetSuccess(Locate.T("Tạo mới danh mục thành công"));
            }
            else
            {
                SetError(Locate.T("Tạo mới danh mục không thành công"));
            }

            return GetResultOrRedirectDefault(defaultPath);
        }
        #endregion
        #region Cap nhat
        public ActionResult Update(int id)
        {
            SetTitle(Locate.T("Cập nhật thông tin danh mục"));
            try
            {
                var categorycha = CategoryRepository.Instance.GetByParent(CUser.IDChannel, 0);
                return GetDialogResultOrView("Create", 600, new CategoryCusModel
                {
                    Url = Locate.Url("/Lione-Demo/change.html"),
                    categorie = CategoryRepository.Instance.GetById(id) ?? new Category(),
                    categories = categorycha,
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
            var item = CategoryRepository.Instance.GetById(Utils.GetInt(DATA, "ID"));
            var _meetingRoom = Utils.BindUpdatedBy<Category>(item, DATA, CUser.ID);
            if (string.IsNullOrEmpty(_meetingRoom.Code))
            {
                SetError(Locate.T("Mã danh mục không được để trống"));
            }
            if (string.IsNullOrEmpty(_meetingRoom.Name))
            {
                SetError(Locate.T("Tên danh mục không được để trống"));
            }
            if (CategoryCusRepository.CheckCode(CUser.IDChannel, _meetingRoom.Code))
            {
                SetError(Locate.T("Mã danh mục này đã tồn tại"));
            }

            
            if (HasError)
            {
                return GetResultOrRedirectDefault(defaultPath);
            }
            if (CategoryCusRepository.Instance.Update(_meetingRoom))
            {
                SetSuccess(Locate.T("Cập nhật danh mục thành công"));
            }
            else
            {
                SetError(Locate.T("Cập nhật danh mục không thành công"));
            }
            return GetResultOrRedirectDefault(Locate.Url(defaultPath));
        }
        #endregion
        #region Delete
        public ActionResult IsDelete(DeleteParam deleteParam)
        {
            var item = CategoryCusRepository.Instance.GetById(deleteParam.ID);
            if (Equals(item, null))
            {
                SetError(Locate.T("Thông tin này không còn tồn tại"));
                return GetResultOrRedirectDefault(defaultPath);
            }
            
            return GetDialogResultOrViewDelete(new DeleteParam
            {
                ID = deleteParam.ID,
                RedirectPath = GetRedirectOrDefault(defaultPath),
                Action = Locate.Url("/Lione-Demo/delete.html"),
                BackTitle = Locate.T("Quay lại danh sách"),
                ConfTitle = Locate.T("Bạn có đồng ý xóa"),
                Title = Locate.T("Xác nhận xóa thông tin")
            });
        }
        public ActionResult Delete(DeleteParam deleteParam)
        {
            var item = CategoryCusRepository.Instance.GetById(deleteParam.ID);
            if (Utils.IsEmpty(item))
            {
                SetError(Locate.T("Thông tin này không còn tồn tại"));
            }
            else
            {
               
                if (CategoryCusRepository.Instance.Delete(item))
                {
                   
                    SetSuccess(Locate.T("Xóa thông tin thành công"));
                }

                else
                    SetError(Locate.T("Lỗi: xóa thông tin không thành công"));
            }

            return GetResultOrRedirectDefault(defaultPath);
        }

        #endregion

    }
}