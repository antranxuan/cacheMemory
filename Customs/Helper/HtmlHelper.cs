using DocproPVEP.Customs.Enum;
using DocproPVEP.Customs.Utility;
using DocProModel.Models;
using DocProUtil;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web.Mvc;
using System.Web.Routing;
using HtmlHelper = System.Web.Mvc.HtmlHelper;
using SelectListItem = System.Web.Mvc.SelectListItem;

namespace DocproPVEP.Customs.Helper
{
    public class CustomSelectItem : SelectListItem
    {
        public string Class { get; set; }
        public string SelectedValue { get; set; }
    }
    public static class HelperHtml
    {
        public static MvcHtmlString RenderStatusHC(this HtmlHelper html, int TrangThai)
        {
            StringBuilder stb = new StringBuilder();

            try
            {
                var exclass = "label label-info";
                var status = "Còn hạn";
                if (TrangThai == (int)TrangThaiHoChieu.Huy)
                {
                    exclass = "label label-danger";
                    status = "Hủy";
                    stb.AppendFormat("&nbsp;<label class=\"{0}\">{1}</label>", exclass, status);
                }
                else
                {
                    if (TrangThai == (int)TrangThaiHoChieu.HetHan)
                    {
                        exclass = "label label-warning";
                        status = "Hết hạn";
                        stb.AppendFormat("&nbsp;<label class=\"{0}\">{1}</label>", exclass, status);
                    }
                    else
                    {
                        exclass = "label label-info";
                        status = "Còn hạn";
                        stb.AppendFormat("&nbsp;<label class=\"{0}\">{1}</label>", exclass, status);
                    }
                }


                return new MvcHtmlString(stb.ToString());
            }
            catch (Exception)
            {

            }
            return new MvcHtmlString("");
        }
        public static MvcHtmlString RenderStatusHC(this HtmlHelper html, DateTime NgayHetHan, bool Huy)
        {
            StringBuilder stb = new StringBuilder();

            try
            {
                var exclass = "label label-info";
                var status = "Còn hạn";
                if (Huy)
                {
                    exclass = "label label-danger";
                    status = "Hủy";
                    stb.AppendFormat("&nbsp;<label class=\"{0}\">{1}</label>", exclass, status);
                }
                else
                {
                    if (NgayHetHan < DateTime.Now)
                    {
                        exclass = "label label-warning";
                        status = "Hết hạn";
                        stb.AppendFormat("&nbsp;<label class=\"{0}\">{1}</label>", exclass, status);
                    }
                    else
                    {
                        exclass = "label label-info";
                        status = "Còn hạn";
                        stb.AppendFormat("&nbsp;<label class=\"{0}\">{1}</label>", exclass, status);
                    }
                }


                return new MvcHtmlString(stb.ToString());
            }
            catch (Exception)
            {

            }
            return new MvcHtmlString("");
        }
        public static MvcHtmlString CusTextBoxDate(this HtmlHelper html, string id, string name, object value, string displayname, string placeholder = "", bool isNotEmpty = false, object htmlAttributes = null, int maxlen = 0, bool isReadOnly = false)
        {
            TagBuilder tag = new TagBuilder("input");
            if (maxlen > 0)
            {
                tag.MergeAttribute("data-bv-stringlength-message", displayname + Locate.T(" không được vượt quá {0} ký tự", maxlen));
                tag.MergeAttribute("data-bv-stringlength-max", maxlen.ToString());
                tag.MergeAttribute("minlength", "0");
            }

            if (isReadOnly)
            {
                tag.MergeAttribute("readonly", string.Empty);
                tag.MergeAttribute("class", "form-control");
            }
            else
            {
                tag.MergeAttribute("class", "form-control date");
            }
            tag.setCommonTextBox(id, name, value, displayname, placeholder, isNotEmpty, htmlAttributes);
            return new MvcHtmlString(tag.ToString());
        }

        public static MvcHtmlString CusTextBoxDateVali(this HtmlHelper html, string id, string name, object value, string displayname, string placeholder = "", bool isNotEmpty = false, object htmlAttributes = null, int maxlen = 0, bool isReadOnly = false)
        {
            TagBuilder tag = new TagBuilder("input");
            if (maxlen > 0)
            {
                tag.MergeAttribute("data-bv-stringlength-message", displayname + Locate.T(" không được vượt quá {0} ký tự", maxlen));
                tag.MergeAttribute("data-bv-stringlength-max", maxlen.ToString());
                tag.MergeAttribute("minlength", "0");
            }

            if (isReadOnly)
            {
                tag.MergeAttribute("readonly", string.Empty);
                tag.MergeAttribute("class", "form-control");
            }
            else
            {
                tag.MergeAttribute("class", "form-control datevali");
            }
            tag.setCommonTextBox(id, name, value, displayname, placeholder, isNotEmpty, htmlAttributes);
            return new MvcHtmlString(tag.ToString());
        }

        /// <summary>
        /// Tự sinh text box Datetime
        /// </summary>
        /// <param name="id">ID</param>
        /// <param name="name">Tên</param>
        /// <param name="displayname">Tên hiển thị</param>
        /// <param name="value">Giá trị</param>
        /// <param name="placeholder">placeholder</param>
        /// <param name="isNotEmpty">Trạng thái bắt buộc</param>
        /// <param name="msgNotEmpty">Thông báo lỗi bắt buộc</param>
        /// <param name="msgdigits">Thông báo lỗi định dạng số</param>
        /// <param name="htmlAttributes">Các thuộc tính khác</param>
        /// <returns></returns>
        public static MvcHtmlString CusTextBoxDateTime(this HtmlHelper html, string id, string name, object value, string displayname, string placeholder = "", bool isNotEmpty = false, object htmlAttributes = null, int maxlen = 0)
        {
            TagBuilder tag = new TagBuilder("input");
            if (maxlen > 0)
            {
                tag.MergeAttribute("data-bv-stringlength-message", displayname + Locate.T(" không được vượt quá {0} ký tự", maxlen));
                tag.MergeAttribute("data-bv-stringlength-max", maxlen.ToString());
                tag.MergeAttribute("minlength", "0");
            }
            tag.MergeAttribute("class", "form-control datetime");
            tag.setCommonTextBox(id, name, value, displayname, placeholder, isNotEmpty, htmlAttributes);
            return new MvcHtmlString(tag.ToString());
        }


        /// <summary>
        /// Tự sinh text box
        /// </summary>
        /// <param name="id">ID</param>
        /// <param name="name">Tên</param>
        /// <param name="displayname">Tên hiển thị</param>
        /// <param name="value">Giá trị</param>
        /// <param name="placeholder">placeholder</param>
        /// <param name="isNotEmpty">Trạng thái bắt buộc</param>
        /// <param name="msgNotEmpty">Thông báo lỗi bắt buộc</param>
        /// <param name="msgdigits">Thông báo lỗi định dạng số</param>
        /// <param name="htmlAttributes">Các thuộc tính khác</param>
        /// <returns></returns>
        public static MvcHtmlString CusTextBox(this HtmlHelper html, string id, string name, object value, string displayname, string placeholder = "", bool isNotEmpty = false, object htmlAttributes = null, int maxlen = 0, bool isReadOnly = false)
        {
            var tag = new TagBuilder("input");
            if (maxlen > 0)
            {
                tag.MergeAttribute("data-bv-stringlength-message", displayname + Locate.T(" không được vượt quá {0} ký tự", maxlen));
                tag.MergeAttribute("data-bv-stringlength-max", maxlen.ToString());
                tag.MergeAttribute("minlength", "0");
                tag.MergeAttribute("data-bv", "true");
            }

            if (isReadOnly)
            {
                tag.MergeAttribute("readonly", string.Empty);
            }
            tag.setCommonTextBox(id, name, value, displayname, placeholder, isNotEmpty, htmlAttributes);
            return new MvcHtmlString(tag.ToString());
        }


        /// <summary>
        /// Tự sinh text box số điện thoại
        /// </summary>
        /// <param name="id">ID</param>
        /// <param name="name">Tên</param>
        /// <param name="displayname">Tên hiển thị</param>
        /// <param name="value">Giá trị</param>
        /// <param name="placeholder">placeholder</param>
        /// <param name="isNotEmpty">Trạng thái bắt buộc</param>
        /// <param name="msgNotEmpty">Thông báo lỗi bắt buộc</param>
        /// <param name="msgdigits">Thông báo lỗi định dạng số</param>
        /// <param name="htmlAttributes">Các thuộc tính khác</param>
        /// <param name="country">chuẩn quốc gia áp dụng, mặc định = VI</param>
        /// <returns></returns>
        public static MvcHtmlString CusTextBoxPhone(this HtmlHelper html, string id, string name, object value, string displayname, string placeholder = "", bool isNotEmpty = false, object htmlAttributes = null, string country = "VI", bool disabled = false)
        {
            TagBuilder tag = new TagBuilder("input");
            tag.MergeAttribute("data-bv-phone-country", country);
            tag.MergeAttribute("data-bv-phone-message", Locate.T("Số điện thoại sai định dạng"));
            tag.MergeAttribute("data-bv-phone", "true");
            tag.MergeAttribute("data-title-show", Locate.T("Số điện thoại không đúng định dạng"));
            tag.setCommonTextBox(id, name, value, displayname, placeholder, isNotEmpty, htmlAttributes, false, disabled);
            return new MvcHtmlString(tag.ToString());
        }


        /// <summary>
        /// Tự sinh text box kiểu số
        /// </summary>
        /// <param name="id">ID</param>
        /// <param name="name">Tên</param>
        /// <param name="displayname">Tên hiển thị</param>
        /// <param name="value">Giá trị</param>
        /// <param name="placeholder">placeholder</param>
        /// <param name="isNotEmpty">Trạng thái bắt buộc</param>
        /// <param name="msgNotEmpty">Thông báo lỗi bắt buộc</param>
        /// <param name="isdigits">Trạng thái text box là số</param>
        /// <param name="msgdigits">Thông báo lỗi định dạng số</param>
        /// <param name="htmlAttributes">Các thuộc tính khác</param>
        /// <returns></returns>
        public static MvcHtmlString CusTextBoxDigit(this HtmlHelper html, string id, string name, object value, string displayname, string placeholder = "", bool isNotEmpty = false, object htmlAttributes = null, int maxkytu = 0, int maxlen = 0, bool isReadOnly = false)
        {
            TagBuilder tag = new TagBuilder("input");
            tag.setCommonTextBox(id, name, value, displayname, placeholder, isNotEmpty, htmlAttributes);
            tag.MergeAttribute("data-bv-digits-message", displayname + Locate.T(" phải là kiểu số"));
            tag.MergeAttribute("data-bv-digits", "true");
            if (maxlen > 0)
            {
                tag.MergeAttribute("data-bv-between-message", displayname + Locate.T(" không được vượt quá {0}", maxlen));
                tag.MergeAttribute("data-bv-between-max", maxlen.ToString());
                tag.MergeAttribute("data-bv-between-min", "0");
                tag.MergeAttribute("data-bv-between", "true");
            }
            if (maxkytu > 0)
            {
                tag.MergeAttribute("data-bv-stringlength-message", displayname + Locate.T(" không được vượt quá {0} ký tự", maxkytu));
                tag.MergeAttribute("data-bv-stringlength-max", maxkytu.ToString());
                tag.MergeAttribute("minlength", "0");
                tag.MergeAttribute("data-bv", "true");
            }
            if (isReadOnly)
            {
                tag.MergeAttribute("readonly", string.Empty);
            }
            return new MvcHtmlString(tag.ToString());
        }
        public static MvcHtmlString CusTextBoxDigitpositive(this HtmlHelper html, string id, string name, object value, string displayname, string placeholder = "", bool isNotEmpty = false, object htmlAttributes = null, int maxkytu = 0, int maxlen = 0, bool isReadOnly = false)
        {
            TagBuilder tag = new TagBuilder("input");
            tag.setCommonTextBox(id, name, value, displayname, placeholder, isNotEmpty, htmlAttributes);
            tag.MergeAttribute("data-bv-digits-message", displayname + Locate.T(" phải là kiểu số nguyên dương"));
            tag.MergeAttribute("data-bv-digits", "true");

            if (maxlen > 0)
            {
                tag.MergeAttribute("data-bv-between-message", displayname + Locate.T(" không được vượt quá {0}", maxlen));
                tag.MergeAttribute("data-bv-between-max", maxlen.ToString());
                tag.MergeAttribute("data-bv-between-min", "0");
                tag.MergeAttribute("data-bv-between", "true");
            }
            if (maxkytu > 0)
            {
                tag.MergeAttribute("data-bv-stringlength-message", displayname + Locate.T(" không được vượt quá {0} ký tự", maxkytu));
                tag.MergeAttribute("data-bv-stringlength-max", maxkytu.ToString());
                tag.MergeAttribute("minlength", "0");
                tag.MergeAttribute("data-bv", "true");
            }
            if (isReadOnly)
            {
                tag.MergeAttribute("readonly", string.Empty);
            }
            return new MvcHtmlString(tag.ToString());
        }
        /// <summary>
        /// Tự sinh text box kiểu bắt buộc, hoặc số
        /// </summary>
        /// <param name="id">ID</param>
        /// <param name="name">Tên</param>
        /// <param name="displayname">Tên hiển thị</param>
        /// <param name="value">Giá trị</param>
        /// <param name="placeholder">placeholder</param>
        /// <param name="htmlAttributes">Các thuộc tính khác</param>
        /// <returns></returns>
        public static MvcHtmlString CusTextBoxNomal(this HtmlHelper html, string id, string name, object value = null, string placeholder = "", object htmlAttributes = null)
        {
            TagBuilder tag = new TagBuilder("input");
            tag.setCommonTextBox(id, name, value, placeholder, placeholder, false, htmlAttributes);
            return new MvcHtmlString(tag.ToString());
        }
        /// <summary>
        /// Tự sinh Dropdowlist
        /// </summary>
        /// <param name="name">Tên</param>
        /// <param name="id">ID</param>
        /// <param name="optionLabel">Hiển thị tìm kiếm tất cả</param>
        /// <param name="list">Dach sách phần tử của select</param>
        /// <param name="htmlAttributes">các thuộc tính thêm</param>
        /// <returns></returns>
        public static MvcHtmlString CusDropdownList(this HtmlHelper htmlHelper, string id, string name, string optionLabel, IEnumerable<SelectListItem> list, object htmlAttributes = null)
        {
            string fullName = htmlHelper.ViewContext.ViewData.TemplateInfo.GetFullHtmlFieldName(name);
            if (String.IsNullOrEmpty(fullName))
            {
                throw new ArgumentException("name");
            }
            TagBuilder dropdown = new TagBuilder("select");
            dropdown.setCommonDropdowList(name, id, optionLabel, list, htmlAttributes);
            return MvcHtmlString.Create(dropdown.ToString(TagRenderMode.Normal));
        }
        public static MvcHtmlString CusDropdownList(this HtmlHelper htmlHelper, string id, string name, string optionLabel, IEnumerable<SelectListItem> list, object htmlAttributes = null, bool isNotEmpty = false, string displayname = "", string placeHolder = "",bool disabled=false)
        {
            string fullName = htmlHelper.ViewContext.ViewData.TemplateInfo.GetFullHtmlFieldName(name);
            if (String.IsNullOrEmpty(fullName))
            {
                throw new ArgumentException("name");
            }
            TagBuilder dropdown = new TagBuilder("select");
            dropdown.setCommonDropdowList(name, id, optionLabel, list, htmlAttributes, displayname, isNotEmpty, disabled, 0, placeHolder);
            return MvcHtmlString.Create(dropdown.ToString(TagRenderMode.Normal));
        }
        /// <summary>
        /// Tự sinh Dropdowlist dạng select2
        /// </summary>
        /// <param name="name">Tên</param>
        /// <param name="id">ID</param>
        /// <param name="optionLabel">Hiển thị tìm kiếm tất cả</param>
        /// <param name="list">Dach sách phần tử của select</param>
        /// <param name="htmlAttributes">các thuộc tính thêm</param>
        /// <returns></returns>
        public static MvcHtmlString CusDropdownListSelect2(this HtmlHelper htmlHelper, string id, string name, string optionLabel, IEnumerable<SelectListItem> list, object htmlAttributes = null, string displayName = "", bool isNotEmpty = false, bool disabled = false)
        {
            string fullName = htmlHelper.ViewContext.ViewData.TemplateInfo.GetFullHtmlFieldName(name);
            if (String.IsNullOrEmpty(fullName))
            {
                throw new ArgumentException("name");
            }
            TagBuilder dropdown = new TagBuilder("select");
            IDictionary<string, object> attributes = HtmlHelper.AnonymousObjectToHtmlAttributes(htmlAttributes);
            if (!attributes.ContainsKey("class"))
            {
                dropdown.Attributes.Add("class", "form-control autoSelect2");
            }
            dropdown.setCommonDropdowList(name, id, optionLabel, list, htmlAttributes, displayName, isNotEmpty, disabled);
            return MvcHtmlString.Create(dropdown.ToString(TagRenderMode.Normal));
        }
        /// <summary>
        /// Tự sinh Dropdowlist dạng select2
        /// </summary>
        /// <param name="name">Tên</param>
        /// <param name="id">ID</param>
        /// <param name="optionLabel">Hiển thị tìm kiếm tất cả</param>
        /// <param name="list">Dach sách phần tử của select</param>
        /// <param name="htmlAttributes">các thuộc tính thêm</param>
        /// <returns></returns>
        public static MvcHtmlString CustomDropdownListSelect2(this HtmlHelper htmlHelper, string id, string name, string optionLabel, IEnumerable<SelectListItem> list, object htmlAttributes = null, bool isNotEmpty = false, string displayname = "", bool isSelectChange = false, string target = "", string url = "")
        {
            string fullName = htmlHelper.ViewContext.ViewData.TemplateInfo.GetFullHtmlFieldName(name);
            if (String.IsNullOrEmpty(fullName))
            {
                throw new ArgumentException("name");
            }
            var dropdown = new TagBuilder("select");
            dropdown.Attributes.Add("data-live-search", "true");
            if (isSelectChange)
            {
                dropdown.Attributes.Add("class", "form-control select_change  autoSelect2 selectpicker");// remove autoSelect2
                dropdown.Attributes.Add("data-target", target);
                dropdown.Attributes.Add("data-url", url);
            }
            else
            {
                dropdown.Attributes.Add("class", "form-control autoSelect2 selectpicker");// remove autoSelect2              
            }
            dropdown.setCommonDropdowList(name, id, optionLabel, list, htmlAttributes, displayname, isNotEmpty);
            return MvcHtmlString.Create(dropdown.ToString(TagRenderMode.Normal));
        }
        /// <summary>
        /// Tự sinh Dropdowlist dạng select3
        /// </summary>
        /// <param name="name">Tên</param>
        /// <param name="id">ID</param>
        /// <param name="optionLabel">Hiển thị tìm kiếm tất cả</param>
        /// <param name="list">Dach sách phần tử của select</param>
        /// <param name="htmlAttributes">các thuộc tính thêm</param>
        /// <param name="otherValue">giá trị liên quan khác</param>
        /// <returns></returns>
        public static MvcHtmlString CustomDropdownListSelect3(this HtmlHelper htmlHelper, string id, string name, string optionLabel, IEnumerable<SelectListItem> list, object htmlAttributes = null, string otherValue = null, bool isNotEmpty = false, string displayname = "", bool isSelectChange = false, string target = "", string url = "")
        {
            string fullName = htmlHelper.ViewContext.ViewData.TemplateInfo.GetFullHtmlFieldName(name);
            if (String.IsNullOrEmpty(fullName))
            {
                throw new ArgumentException("name");
            }
            var dropdown = new TagBuilder("select");
            dropdown.Attributes.Add("data-live-search", "true");
            if (isSelectChange)
            {
                dropdown.Attributes.Add("class", "form-control select_change3  autoSelect2 selectpicker");// remove autoSelect2
                dropdown.Attributes.Add("data-target", target);
                dropdown.Attributes.Add("data-url", url);
            }
            else
            {
                dropdown.Attributes.Add("class", "form-control autoSelect2 selectpicker");// remove autoSelect2              
            }
            dropdown.setCommonDropdowList3(name, id, optionLabel, list, htmlAttributes, displayname, isNotEmpty, false, 0, String.Empty, otherValue);
            return MvcHtmlString.Create(dropdown.ToString(TagRenderMode.Normal));
        }
        /// <summary>
        /// Tự sinh Dropdowlist dạng chọn nhiều
        /// </summary>
        /// <param name="name">Tên</param>
        /// <param name="id">ID</param>
        /// <param name="optionLabel">Hiển thị tìm kiếm tất cả</param>
        /// <param name="list">Dach sách phần tử của select</param>
        /// <param name="htmlAttributes">các thuộc tính thêm</param>
        /// <param name="size">Số phần tử hiển thị</param>
        /// <returns></returns>
        public static MvcHtmlString CusDropdownListPicker(this HtmlHelper htmlHelper, string id, string name, string optionLabel, IEnumerable<SelectListItem> list, string placeholder, object htmlAttributes = null, string displayname = "", bool isNotEmpty = false, bool isMultiple = true, bool disabled = false, int size = 5, int defaultValue = 0)
        {
            string fullName = htmlHelper.ViewContext.ViewData.TemplateInfo.GetFullHtmlFieldName(name);
            if (String.IsNullOrEmpty(fullName))
            {
                throw new ArgumentException("name");
            }
            TagBuilder dropdown = new TagBuilder("select");

            IDictionary<string, object> attributes = HtmlHelper.AnonymousObjectToHtmlAttributes(htmlAttributes);
            if (!attributes.ContainsKey("class"))
            {
                dropdown.Attributes.Add("class", "selectpicker");
            }
            if (isMultiple)
            {
                dropdown.Attributes.Add("multiple", "true");
                dropdown.Attributes.Add("data-deselect-all-text", Locate.T("Bỏ chọn"));
                dropdown.Attributes.Add("data-select-all-text", Locate.T("Chọn tất cả"));
            }
            dropdown.Attributes.Add("data-live-search", "true");
            dropdown.Attributes.Add("data-live-search-placeholder", placeholder);
            dropdown.Attributes.Add("data-actions-box", "true");
            dropdown.Attributes.Add("data-none-selected-text", placeholder);
            dropdown.Attributes.Add("data-container", "body");
            //dropdown.Attributes.Add("data-width", "auto");
            dropdown.Attributes.Add("data-size", size.ToString());
            dropdown.setCommonDropdowList(name, id, optionLabel, list, htmlAttributes, displayname, isNotEmpty, disabled, defaultValue);
            return MvcHtmlString.Create(dropdown.ToString(TagRenderMode.Normal));
        }


        /// <summary>
        /// Tự sinh Dropdowlist
        /// </summary>
        /// <param name="name">Tên</param>
        /// <param name="id">ID</param>
        /// <param name="optionLabel">Hiển thị tìm kiếm tất cả</param>
        /// <param name="list">Dach sách phần tử của select</param>
        /// <param name="htmlAttributes">các thuộc tính thêm</param>
        /// <returns></returns>
        public static MvcHtmlString CusDropdownList(this HtmlHelper htmlHelper, string id, string name, string optionLabel, IEnumerable<SelectListItem> list, object htmlAttributes = null, string displayname = "", bool isNotEmpty = false)
        {
            string fullName = htmlHelper.ViewContext.ViewData.TemplateInfo.GetFullHtmlFieldName(name);
            if (String.IsNullOrEmpty(fullName))
            {
                throw new ArgumentException("name");
            }
            TagBuilder dropdown = new TagBuilder("select");
            dropdown.setCommonDropdowList(name, id, optionLabel, list, htmlAttributes, displayname, isNotEmpty);
            return MvcHtmlString.Create(dropdown.ToString(TagRenderMode.Normal));
        }

        /// <summary>
        /// Tự sinh Dropdowlist dạng select2
        /// </summary>
        /// <param name="name">Tên</param>
        /// <param name="id">ID</param>
        /// <param name="optionLabel">Hiển thị tìm kiếm tất cả</param>
        /// <param name="list">Dach sách phần tử của select</param>
        /// <param name="htmlAttributes">các thuộc tính thêm</param>
        /// <returns></returns>
        public static MvcHtmlString CusCategoryDropdownList(this HtmlHelper htmlHelper, string id, string name, string optionLabel, List<Category> list, object htmlAttributes = null, string displayName = "", bool isNotEmpty = false, int selected = 0, bool excludeParent = false)
        {
            string fullName = htmlHelper.ViewContext.ViewData.TemplateInfo.GetFullHtmlFieldName(name);
            if (String.IsNullOrEmpty(fullName))
            {
                throw new ArgumentException("name");
            }
            TagBuilder dropdown = new TagBuilder("select");
            dropdown.Attributes.Add("class", "form-control autoSelect2");
            dropdown.setCommonCategoryDropdowList(name, id, optionLabel, list, htmlAttributes, displayName, isNotEmpty, new[] { selected }, excludeParent);
            return MvcHtmlString.Create(dropdown.ToString(TagRenderMode.Normal));
        }
        public static MvcHtmlString CusCategoryPicker(this HtmlHelper htmlHelper, string id, string name, string optionLabel, List<Category> list, string placeholder, object htmlAttributes = null, string displayname = "", int[] selected = null, bool isNotEmpty = false, bool excludeParent = false, bool isMultiple = true, int size = 5, bool isPicker = true)
        {
            string fullName = htmlHelper.ViewContext.ViewData.TemplateInfo.GetFullHtmlFieldName(name);
            if (String.IsNullOrEmpty(fullName))
            {
                throw new ArgumentException("name");
            }
            TagBuilder dropdown = new TagBuilder("select");
            if (isPicker)
                dropdown.Attributes.Add("class", "selectpicker");
            else
                dropdown.Attributes.Add("class", "form-control autoSelect2");
            if (isMultiple)
            {
                dropdown.Attributes.Add("multiple", "true");
                dropdown.Attributes.Add("data-deselect-all-text", Locate.T("Bỏ chọn"));
                dropdown.Attributes.Add("data-select-all-text", Locate.T("Chọn tất cả"));
            }
            dropdown.Attributes.Add("data-live-search", "true");
            dropdown.Attributes.Add("data-live-search-placeholder", placeholder);
            dropdown.Attributes.Add("data-actions-box", "true");
            dropdown.Attributes.Add("data-none-selected-text", placeholder);
            dropdown.Attributes.Add("data-container", "body");
            //dropdown.Attributes.Add("data-width", "auto");
            dropdown.Attributes.Add("data-size", size.ToString());
            dropdown.setCommonCategoryDropdowList(name, id, optionLabel, list, htmlAttributes, displayname, isNotEmpty, selected, excludeParent);
            return MvcHtmlString.Create(dropdown.ToString(TagRenderMode.Normal));
        }


        /// <summary>
        /// Tự sinh text box kiểu bắt buộc, hoặc số
        /// </summary>
        /// <param name="id">ID</param>
        /// <param name="name">Tên</param>
        /// <param name="displayname">Tên hiển thị</param>
        /// <param name="value">Giá trị</param>
        /// <param name="placeholder">placeholder</param>
        /// <param name="isNotEmpty">Bắt buộc nhập?</param>
        /// <param name="htmlAttributes">Các thuộc tính khác</param>
        /// <returns></returns>
        public static MvcHtmlString CusTextBoxMoney(this HtmlHelper html, string id, string name, string displayname, object value = null, string placeholder = "", bool isNotEmpty = false, object htmlAttributes = null, bool isReadOnly = false)
        {
            TagBuilder tag = new TagBuilder("input");
            if (isReadOnly)
            {
                tag.MergeAttribute("readonly", string.Empty);
            }
            tag.setCommonTextBox(id, name, value, placeholder, placeholder, isNotEmpty, htmlAttributes, true);
            return new MvcHtmlString(tag.ToString());
        }
        public static MvcHtmlString CusTextBoxMoneyDec(this HtmlHelper html, string id, string name, string displayname, object value = null, string placeholder = "", bool isNotEmpty = false, object htmlAttributes = null, bool isReadOnly = false)
        {
            TagBuilder tag = new TagBuilder("input");
            if (isReadOnly)
            {
                tag.MergeAttribute("readonly", string.Empty);
            }
            tag.setCommonTextBox(id, name, value, placeholder, placeholder, isNotEmpty, htmlAttributes, true, false, true);
            return new MvcHtmlString(tag.ToString());
        }
        private static void setCommonDropdowList(this TagBuilder dropdown, string name, string id, string optionLabel, IEnumerable<SelectListItem> list, object htmlAttributes, string displayname = "", bool isNotEmpty = false, bool disabled = false, int defaultValue = 0, string placeHolder = "")
        {
            dropdown.Attributes.Add("name", name);
            dropdown.Attributes.Add("id", id);
            if (htmlAttributes != null)
            {
                IDictionary<string, object> attributes = HtmlHelper.AnonymousObjectToHtmlAttributes(htmlAttributes);
                foreach (var item in attributes)
                {
                    if ((item.Key.ToLower() == "disabled" || item.Key.ToLower() == "readonly") && item.Value.ToString().ToLower() == "false")
                        continue;
                    dropdown.MergeAttribute(item.Key, item.Value.ToString());
                }
            }
            if (isNotEmpty)
            {
                dropdown.MergeAttribute("data-bv-field", name);//data-container="body"
                dropdown.MergeAttribute("data-bv-notempty-message", Locate.T("{0} không được để trống", displayname));
                dropdown.MergeAttribute("data-bv-notempty", "true");
            }
            if (placeHolder.IsNotEmpty())
            {
                dropdown.MergeAttribute("data-live-search-placeholder", placeHolder);
            }
            if (disabled)
            {
                dropdown.MergeAttribute("disabled", "");
            }
            StringBuilder options = new StringBuilder();
            if (!string.IsNullOrEmpty(optionLabel))
                options.Append("<option value='" + defaultValue + "'>" + optionLabel + "</option>");
            foreach (var item in list)
            {
                var isDisabled = item.Disabled ? "disabled" : string.Empty;
                var isSelected = item.Selected ? "selected" : string.Empty;
                options.Append("<option value='" + item.Value + "'" + isDisabled + " " + isSelected + ">" + item.Text + "</option>");
            }
            dropdown.InnerHtml = options.ToString();
        }
        private static void setCommonDropdowList3(this TagBuilder dropdown, string name, string id, string optionLabel, IEnumerable<SelectListItem> list, object htmlAttributes, string displayname = "", bool isNotEmpty = false, bool disabled = false, int defaultValue = 0, string placeHolder = "", string otherValue = "")
        {
            dropdown.Attributes.Add("name", name);
            dropdown.Attributes.Add("id", id);
            if (htmlAttributes != null)
            {
                IDictionary<string, object> attributes = HtmlHelper.AnonymousObjectToHtmlAttributes(htmlAttributes);
                foreach (var item in attributes)
                {
                    if ((item.Key.ToLower() == "disabled" || item.Key.ToLower() == "readonly") && item.Value.ToString().ToLower() == "false")
                        continue;
                    dropdown.MergeAttribute(item.Key, item.Value.ToString());
                }
            }
            if (isNotEmpty)
            {
                dropdown.MergeAttribute("data-bv-field", name);//data-container="body"
                dropdown.MergeAttribute("data-bv-notempty-message", Locate.T("{0} không được để trống", displayname));
                dropdown.MergeAttribute("data-bv-notempty", "true");
            }
            if (placeHolder.IsNotEmpty())
            {
                dropdown.MergeAttribute("data-live-search-placeholder", placeHolder);
            }
            if (disabled)
            {
                dropdown.MergeAttribute("disabled", "");
            }
            if (otherValue != "")
            {
                dropdown.MergeAttribute("data-other-value", otherValue);
            }
            StringBuilder options = new StringBuilder();
            if (!string.IsNullOrEmpty(optionLabel))
                options.Append("<option value='" + defaultValue + "'>" + optionLabel + "</option>");
            foreach (var item in list)
            {
                var isDisabled = item.Disabled ? "disabled" : string.Empty;
                var isSelected = item.Selected ? "selected" : string.Empty;
                options.Append("<option value='" + item.Value + "'" + isDisabled + " " + isSelected + ">" + item.Text + "</option>");
            }
            dropdown.InnerHtml = options.ToString();
        }
        private static void setCommonTextBox(this TagBuilder tag, string id, string name, object value, string displayname, string placeholder = "", bool isNotEmpty = false, object htmlAttributes = null, bool isMoney = false, bool disabled = false, bool _decimal = false)
        {
            var attributes = new RouteValueDictionary();
            if (htmlAttributes != null)
            {
                attributes = HtmlHelper.AnonymousObjectToHtmlAttributes(htmlAttributes);
            }
            attributes.Add("type", "text");
            attributes.Add("id", id);
            attributes.Add("name", name);
            attributes.Add("placeholder", placeholder);
            attributes.Add("title", displayname);
            attributes.Add("data-bv-field", name);
            if (disabled)
            {
                attributes.Add("disabled", disabled);
            }
            if (isNotEmpty)
            {
                attributes.Add("data-bv-notempty-message", displayname + Locate.T(" không được để trống"));
                attributes.Add("data-bv-notempty", "true");
            }

            if (Utils.IsNotEmpty(value))
            {
                attributes.Add("value", value.ToString());
            }

            var defaultClass = isMoney ? "form-control isNumberInteger useMoney " : "form-control ";
            if (_decimal)
            {
                defaultClass = isMoney ? "form-control isNumber useMoney " : "form-control ";
            }


            if (attributes.ContainsKey("class"))
                attributes["class"] = defaultClass + attributes["class"];
            else
                attributes.Add("class", defaultClass);
            tag.MergeAttributes(attributes);
        }
        private static void setCommonTextBoxNegative(this TagBuilder tag, string id, string name, object value, string displayname, string placeholder = "", bool isNotEmpty = false, object htmlAttributes = null, bool isMoney = false, bool disabled = false, bool _decimal = false)
        {
            var attributes = new RouteValueDictionary();
            if (htmlAttributes != null)
            {
                attributes = HtmlHelper.AnonymousObjectToHtmlAttributes(htmlAttributes);
            }
            attributes.Add("type", "text");
            attributes.Add("id", id);
            attributes.Add("name", name);
            attributes.Add("placeholder", placeholder);
            attributes.Add("title", displayname);
            attributes.Add("data-bv-field", name);
            if (disabled)
            {
                attributes.Add("disabled", disabled);
            }
            if (isNotEmpty)
            {
                attributes.Add("data-bv-notempty-message", displayname + Locate.T(" không được để trống"));
                attributes.Add("data-bv-notempty", "true");
            }

            if (Utils.IsNotEmpty(value))
            {
                attributes.Add("value", value.ToString());
            }

            var defaultClass = isMoney ? "form-control isNumberInteger useMoney " : "form-control ";
            if (_decimal)
            {
                defaultClass = isMoney ? "form-control isNumber useMoney " : "form-control ";
            }


            if (attributes.ContainsKey("class"))
                attributes["class"] = defaultClass + attributes["class"];
            else
                attributes.Add("class", defaultClass);
            tag.MergeAttributes(attributes);
        }
        private static void setCommonCategoryDropdowList(this TagBuilder dropdown, string name, string id, string optionLabel, List<Category> list, object htmlAttributes, string displayname, bool isNotEmpty, int[] selected, bool excludeParent)
        {
            list = list ?? new List<Category>();
            dropdown.Attributes.Add("name", name);
            dropdown.Attributes.Add("id", id);
            if (htmlAttributes != null)
            {
                IDictionary<string, object> attributes = HtmlHelper.AnonymousObjectToHtmlAttributes(htmlAttributes);
                foreach (var item in attributes)
                {
                    dropdown.MergeAttribute(item.Key, item.Value.ToString(), true);
                }
            }
            if (isNotEmpty)
            {
                dropdown.MergeAttribute("data-bv-field", name);//data-container="body"
                dropdown.MergeAttribute("data-bv-notempty-message", Locate.T("{0} không được để trống", displayname));
                dropdown.MergeAttribute("data-bv-notempty", "true");
            }
            StringBuilder options = new StringBuilder();
            if (!string.IsNullOrEmpty(optionLabel))
                options.Append("<option value=''>" + optionLabel + "</option>");

            var parent = list.Where(n => n.Parent == 0).OrderBy(n => n.Name).ToList();
            var parentIds = parent.Select(m => m.ID).ToList();
            var singleChilds = list.Where(n => !parentIds.Contains(n.ID) && !parentIds.Contains(n.Parent)).ToList();
            foreach (var item in parent)
            {
                var isDisable = item.Parent == 0;
                var childTypes = list.Where(x => x.Parent == item.ID).ToList();
                options.Append(string.Format("<option {0} value='{1}' {3}>{2}</option>", selected.IsNotEmpty() && selected.Contains(item.ID) && !excludeParent ? "selected" : string.Empty, item.ID, item.Name, isDisable && excludeParent ? "disabled" : string.Empty));

                foreach (var child in childTypes)
                {
                    options.Append(string.Format("<option {0} value='{1}'>-- {2}</option>", selected.IsNotEmpty() && selected.Contains(child.ID) ? "selected" : string.Empty, child.ID, child.Name));
                }
            }

            foreach (var singleChild in singleChilds)
            {
                options.Append(string.Format("<option {0} value='{1}'>{2}</option>", selected.IsNotEmpty() && selected.Contains(singleChild.ID) ? "selected" : string.Empty, singleChild.ID, singleChild.Name));

            }
            dropdown.InnerHtml = options.ToString();
        }


        /// <summary>
        /// Nút sắp sếp
        /// </summary>
        /// <param name="html"></param>
        /// <param name="sortName"></param>
        /// <param name="titleAsc"></param>
        /// <param name="titleDesc"></param>
        /// <param name="dataTarget"></param>
        /// <param name="sortedType"></param>
        /// <param name="sortedName"></param>
        /// <returns></returns>


        public static MvcHtmlString CusTextArea(this HtmlHelper html, string id, string name, object value, string displayname, string placeholder = "", bool isNotEmpty = false, object htmlAttributes = null, int row = 20, int col = 5, int maxlen = 0, bool isReadOnly = false)
        {
            TagBuilder tag = new TagBuilder("textarea");
            tag.MergeAttribute("id", id);
            tag.MergeAttribute("name", name);
            tag.MergeAttribute("class", "form-control");
            tag.MergeAttribute("placeholder", placeholder);
            tag.MergeAttribute("title", placeholder);
            tag.MergeAttribute("rows", row.ToString());
            tag.MergeAttribute("cols", col.ToString());

            if (isNotEmpty)
            {
                tag.MergeAttribute("data-bv-field", name);
                tag.MergeAttribute("data-bv-notempty-message", Locate.T("{0} không được để trống", displayname));
                tag.MergeAttribute("data-bv-notempty", "true");
            }
            if (isReadOnly)
            {
                tag.MergeAttribute("readonly", string.Empty);
            }
            if (maxlen > 0)
            {
                tag.MergeAttribute("data-bv-stringlength-message", displayname + Locate.T(" không được vượt quá {0} ký tự", maxlen));
                tag.MergeAttribute("data-bv-stringlength-max", maxlen.ToString());
                tag.MergeAttribute("minlength", "0");
                tag.MergeAttribute("data-bv", "true");
            }
            if (Utils.IsNotEmpty(value))
                tag.SetInnerText(value.ToString());
            if (htmlAttributes != null)
            {
                var attributes = HtmlHelper.AnonymousObjectToHtmlAttributes(htmlAttributes);
                tag.MergeAttributes(attributes);
            }
            return new MvcHtmlString(tag.ToString());
        }
        public static MvcHtmlString CusTextAreaCustom(this HtmlHelper html, string id, string name, object value, string displayname, string placeholder = "", bool isNotEmpty = false, object htmlAttributes = null, int row = 20, int col = 5, int maxlen = 0, bool disabled = false)
        {
            TagBuilder tag = new TagBuilder("textarea");
            tag.MergeAttribute("id", id);
            tag.MergeAttribute("name", name);
            tag.MergeAttribute("class", "form-control");
            tag.MergeAttribute("placeholder", placeholder);
            tag.MergeAttribute("title", placeholder);
            tag.MergeAttribute("rows", row.ToString());
            tag.MergeAttribute("cols", col.ToString());

            if (isNotEmpty)
            {
                tag.MergeAttribute("data-bv-field", name);
                tag.MergeAttribute("data-bv-notempty-message", Locate.T("{0} không được để trống", displayname));
                tag.MergeAttribute("data-bv-notempty", "true");
            }
            if (disabled)
            {
                tag.MergeAttribute("disabled", true.ToString());
            }
            if (Utils.IsNotEmpty(value))
                tag.SetInnerText(value.ToString());
            if (htmlAttributes != null)
            {
                var attributes = HtmlHelper.AnonymousObjectToHtmlAttributes(htmlAttributes);
                tag.MergeAttributes(attributes);
            }
            return new MvcHtmlString(tag.ToString());
        }
        #region--------Status-------
        /// <summary>
        /// Sịnh động Trạng thái
        /// </summary>
        /// <param name="status"></param>
        /// <returns></returns>
        public static MvcHtmlString RenderStatus(this HtmlHelper html, int status)
        {
            //DacPV TODO
            TagBuilder tag = new TagBuilder("lable");
            tag.MergeAttribute("value", status.ToString());
            return new MvcHtmlString("Trạng thái " + tag.ToString());
        }
        #endregion------------------

    }
}