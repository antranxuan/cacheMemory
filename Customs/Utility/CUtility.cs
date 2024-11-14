using ClosedXML;
using ClosedXML.Excel;
using DocProModel.Customs.Params;
using DocProModel.Models;
using DocProModel.Repository;
using DocproPVEP.Customs.Constant;
using DocProUtil;
using DocProUtil.Cf;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using System.Timers;
using System.Web.Mvc;
using System.Web.WebPages;

namespace DocproPVEP.Customs.Utility
{
    public class ItemExcel
    {
        public int Row { get; set; }
        public int Col { get; set; }
        public string Value { get; set; }
        public string Title { get; set; }
        public bool isBold { get; set; }
    }
    public static class CUtility
    {
        private static Timer _timer;
        private static object _locker = new object();
        public static DateTime StartOfWeek(this DateTime dt, DayOfWeek startOfWeek)
        {
            int diff = (7 + (dt.DayOfWeek - startOfWeek)) % 7;
            var date = dt.AddDays(-1 * diff).Date;
            return new DateTime(date.Year, date.Month, date.Day, 0, 0, 0);
        }
        public static bool IsNumeric(object Expression)
        {
            double retNum;

            bool isNum = Double.TryParse(Convert.ToString(Expression), System.Globalization.NumberStyles.Any, System.Globalization.NumberFormatInfo.InvariantInfo, out retNum);
            return isNum;
        }
        public static DateTime ToDateTime(this string datetime, char dateSpliter = '-', char timeSpliter = ':', char millisecondSpliter = ',')
        {
            try
            {
                datetime = datetime.Trim();
                datetime = datetime.Replace("  ", " ");
                string[] body = datetime.Split(' ');
                string[] date = body[0].Split(dateSpliter);
                int year = date[2].AsInt();
                int month = date[1].AsInt();
                int day = date[0].AsInt();
                int hour = 0, minute = 0, second = 0, millisecond = 0;
                if (body.Length == 2)
                {
                    string[] tpart = body[1].Split(millisecondSpliter);
                    string[] time = tpart[0].Split(timeSpliter);
                    hour = time[0].AsInt();
                    minute = time[1].AsInt();
                    if (time.Length == 3) second = time[2].AsInt();
                    if (tpart.Length == 2) millisecond = tpart[1].AsInt();
                }
                return new DateTime(year, month, day, hour, minute, second, millisecond);
            }
            catch
            {
                return new DateTime();
            }
        }
        public static string ConvertMoney(this decimal? money)
        {
            return money.HasValue ? money.Value.ToString("N0", new CultureInfo("en-US")) : string.Empty;
        }
        public static string ConvertMoneyDouble(this double? money)
        {
            return money.HasValue ? money.Value.ToString("N0", new CultureInfo("en-US")) : string.Empty;
        }
        public static bool IsNotEmptyOrNull(string val)
        {
            try
            {
                return !string.IsNullOrEmpty(val) && !string.IsNullOrWhiteSpace(val) && val != "";
            }
            catch (Exception)
            {
                return false;
            }
        }
        public static string GenerateFilePathNameAttacks(string[] paths, string[] fileNames)
        {
            try
            {
                var pathNames = string.Empty;
                if (!Equals(paths, null) && !Equals(fileNames, null))
                {
                    for (int i = 0; i < paths.Count(); i++)
                    {
                        if (!string.IsNullOrEmpty(paths[i]) && !string.IsNullOrEmpty(fileNames[i]))
                        {
                            pathNames += paths[i] + "#" + fileNames[i] + ",";
                        }
                    }
                    pathNames = pathNames.TrimEnd(',');
                }
                return pathNames;
            }
            catch (Exception ex)
            {
                Loger.Log(ex);
                return string.Empty;
            }
        }

        public static DateTime EndOfWeek(this DateTime dt, DayOfWeek startOfWeek)
        {
            int diff = (7 + (dt.DayOfWeek - startOfWeek)) % 7;
            var date = dt.AddDays(-1 * diff).Date;
            date = date.AddDays(7);
            return new DateTime(date.Year, date.Month, date.Day, 23, 59, 59);
        }
        public static bool GetBool(string input)
        {
            input = input.ToLower();
            switch (input)
            {
                case "on":
                case "true":
                case "yes":
                    return true;
                default:
                    return false;
            }

        }
        public static List<int> GetYearsInterPlans(int from = 0, int to = 2000)
        {
            var years = new List<int>();
            from = from == 0 ? DateTime.Now.Year : from;
            for (int i = from; i >= to; i--)
            {
                years.Add(i);
            }
            return years.OrderBy(n=>n).ToList();
        }


        public static string GetValue(this Dictionary<int, string> dic, int key)
        {
            if (dic.ContainsKey(key))
                return dic[key];
            return "Không xác định";
        }
        public static string InscreaseName(string input)
        {
            string result = string.Empty;
            int inscre = 0;
            result = input;
            if (!UserRepository.Instance.UsernameExists(result))
            {
                return result;
            }
            inscre++;
            result = input + inscre;
            while (UserRepository.Instance.UsernameExists(result))
            {
                inscre++;
                result = input + inscre;
            }
            return result;
        }
        /// <summary>
        /// Chuyển đổ tên sang tên viết tắt pham van dac ==? dacpv
        /// </summary>
        /// <param name="input">Tên đầu vào</param>
        /// <returns></returns>
        public static String ConvertBySortName(string input)
        {
            string result = string.Empty;
            while (input.Contains("  "))
                input = input.Replace("  ", " ");
            var arrs = input.Split(' ');
            if (!arrs.Any())
                return string.Empty;
            int lenght = arrs.Length;
            var name = arrs.LastOrDefault();
            var firstname = arrs.FirstOrDefault();
            var shortname = string.Empty;
            firstname = firstname.Substring(0, 1).ToLower();
            if (arrs.Length == 1)
                return name;
            else
            {
                result = name + firstname;
                for (int i = 0; i < lenght; i++)
                {
                    if (i == 0 || i == lenght - 1)
                        continue;
                    result += arrs[i].Substring(0, 1).ToLower();
                }
            }
            return RemoveDiacritics(result);
        }
        public static string RemoveDiacritics(string text)
        {
            string formD = text.Normalize(NormalizationForm.FormD);
            StringBuilder sb = new StringBuilder();

            foreach (char ch in formD)
            {
                UnicodeCategory uc = CharUnicodeInfo.GetUnicodeCategory(ch);
                if (uc != UnicodeCategory.NonSpacingMark)
                {
                    sb.Append(ch);
                }
            }
            return sb.ToString().Normalize(NormalizationForm.FormC);
        }
        public static string RandomString(int length)
        {
            Random random = new Random();
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            return new string(Enumerable.Repeat(chars, length)
              .Select(s => s[random.Next(s.Length)]).ToArray());
        }
        public static long incStep(long i, string type)
        {
            switch (type)
            {
                case "year":
                    return (new DateTime(i).AddYears(1)).Ticks;
                case "month":
                    return (new DateTime(i).AddMonths(1)).Ticks;
            }
            return (new DateTime(i).AddDays(1)).Ticks;
        }
        /// <summary>
        /// Hàm xuất excel 
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="MyWorkBook">MyWorkBook để thực hiện việc save lại</param>
        /// <param name="items">Danh sách dữ liệu của bảng cần xuất trong excel</param>
        /// <param name="headers">Để xác định từng cột lấy từ trường nào trong T</param>
        /// <param name="isshowheader">Dùng head của template hay theo headers</param>
        /// <param name="template">Dường dẫn file teamplate</param>
        /// <param name="rowstart">Vị trị hàng bắt đầu của bảng dữ liệu items</param>
        /// <param name="colstart">Vị trí cột bắt đầu của bảng dữ liệu items</param>
        /// <param name="itemexcels">Danh sách gán giá trị cho từng hàng, cột</param>
        /// <param name="isShowIndex"></param>
        /// <param name="isCustomLastRow"></param>
        /// <param name="isAutoformat"></param>
        /// <returns></returns>
        public static bool ExportExcel<T>(out XLWorkbook MyWorkBook, List<T> items, Dictionary<string, string> headers, bool isshowheader, string template, int rowstart, int colstart, List<ItemExcel> itemexcels, bool isShowIndex = true, bool isCustomLastRow = false, bool isAutoformat = true)
        {
            MyWorkBook = File.Exists(template) ? new XLWorkbook(template) : new XLWorkbook();
            try
            {
                //add item single
                if (itemexcels.IsNotEmpty<ItemExcel>())
                {
                    var firmWorkSheet = MyWorkBook.Worksheet(1);
                    foreach (var itexcel in itemexcels)
                    {
                        firmWorkSheet.Cell(itexcel.Row, itexcel.Col).DataType = XLDataType.Text;
                        firmWorkSheet.Cell(itexcel.Row, itexcel.Col).SetValue<string>(itexcel.Value);
                        firmWorkSheet.Cell(itexcel.Row, itexcel.Col).Style.Font.Bold = itexcel.isBold;
                    }
                }
                // Tạo header 
                int index = 0;
                int sheet = 1;
                if (MyWorkBook.Worksheet(sheet) == null)
                    MyWorkBook.AddWorksheet(sheet.ToString());
                var myWorkSheet = MyWorkBook.Worksheet(sheet);
                if (isshowheader)
                {
                    foreach (var item in headers)
                    {
                        if (isAutoformat)
                        {
                            myWorkSheet.Cell(rowstart, colstart + index).Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center);
                            myWorkSheet.Cell(rowstart, colstart + index).Style.Font.Bold = true;
                        }
                        myWorkSheet.Cell(rowstart, colstart + index).Value = item.Value;
                        myWorkSheet.Cell(rowstart, colstart + index).Style.Alignment.WrapText = true;
                        myWorkSheet.Cell(rowstart, colstart + index).Style.Border.BottomBorder = XLBorderStyleValues.Thin;
                        myWorkSheet.Cell(rowstart, colstart + index).Style.Border.TopBorder = XLBorderStyleValues.Thin;
                        myWorkSheet.Cell(rowstart, colstart + index).Style.Border.RightBorder = XLBorderStyleValues.Thin;
                        myWorkSheet.Cell(rowstart, colstart + index).Style.Border.LeftBorder = XLBorderStyleValues.Thin;
                        index++;
                    }
                }
                int skip = 0;
                int take = 50000;
                var itemSheets = items.Skip(skip).Take(take - rowstart).ToList();
                while (itemSheets.IsNotEmpty())
                {
                    if (MyWorkBook.Worksheet(sheet) == null)
                        MyWorkBook.AddWorksheet(sheet.ToString());
                    myWorkSheet = MyWorkBook.Worksheet(sheet);

                    index = 1;
                    foreach (var item in itemSheets)
                    {
                        var values = item.KeyValue();

                        int col = 0;
                        foreach (var it in headers)
                        {
                            var value = (values.Contains(it.Key) ? values[it.Key] : "") ?? "";
                            if (col == 0 && isShowIndex)
                            {
                                if ((isCustomLastRow && index != items.Count) || !isCustomLastRow)
                                {
                                    myWorkSheet.Cell(rowstart + index, colstart + col).Value = index.ToString();

                                }
                                myWorkSheet.Cell(rowstart + index, colstart + col).Style.Border.BottomBorder = XLBorderStyleValues.Thin;
                                myWorkSheet.Cell(rowstart + index, colstart + col).Style.Border.TopBorder = XLBorderStyleValues.Thin;
                                myWorkSheet.Cell(rowstart + index, colstart + col).Style.Border.RightBorder = XLBorderStyleValues.Thin;
                                myWorkSheet.Cell(rowstart + index, colstart + col).Style.Border.LeftBorder = XLBorderStyleValues.Thin;
                                col++;
                                continue;
                            }
                            if (value is DateTime || value is DateTime?)
                            {
                                myWorkSheet.Cell(rowstart + index, colstart + col).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                                myWorkSheet.Cell(rowstart + index, colstart + col).Style.Alignment.SetWrapText(true);
                                myWorkSheet.Cell(rowstart + index, colstart + col).DataType = XLDataType.DateTime;
                                myWorkSheet.Cell(rowstart + index, colstart + col).SetValue<string>(Utils.DateToString((DateTime)value, "dd-MM-yyyy"));

                            }
                            else
                            {

                                if (isAutoformat)
                                {
                                    XLAlignmentHorizontalValues align;
                                    if (Utils.IsNumber(value.ToString().Replace(",", string.Empty)
                                    .Replace(".", string.Empty).Replace("-", string.Empty).Replace("'", string.Empty)))
                                    {
                                        align = XLAlignmentHorizontalValues.Right;
                                        myWorkSheet.Cell(rowstart + index, colstart + col).DataType = XLDataType.Number;
                                    }
                                    else
                                        align = XLAlignmentHorizontalValues.Left;
                                    myWorkSheet.Cell(rowstart + index, colstart + col).Style.Alignment.SetHorizontal(align);
                                }
                                myWorkSheet.Cell(rowstart + index, colstart + col).DataType = XLDataType.Text;
                                myWorkSheet.Cell(rowstart + index, colstart + col).Value = Convert.ToString(value);
                            }


                            if (isCustomLastRow && index == itemSheets.Count)
                                myWorkSheet.Cell(rowstart + index, colstart + col).Style.Font.Bold = true;

                            //myWorkSheet.Cell(rowstart + index, colstart + col).Style.Alignment.WrapText = true;
                            myWorkSheet.Cell(rowstart + index, colstart + col).Style.Border.BottomBorder = XLBorderStyleValues.Thin;
                            myWorkSheet.Cell(rowstart + index, colstart + col).Style.Border.TopBorder = XLBorderStyleValues.Thin;
                            myWorkSheet.Cell(rowstart + index, colstart + col).Style.Border.RightBorder = XLBorderStyleValues.Thin;
                            myWorkSheet.Cell(rowstart + index, colstart + col).Style.Border.LeftBorder = XLBorderStyleValues.Thin;
                            col++;
                        }
                        index++;
                    }
                    itemSheets = items.Skip((take * sheet) - 1 - rowstart).Take(take).ToList();
                    sheet++;
                }
                return true;
            }
            catch (Exception e)
            {
                Loger.Log(e.ToString(), "export");
                return false;
            }
        }


        // cấu hình thông báo
    }
}