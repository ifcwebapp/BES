using System;
using System.Linq;
using BusinessEnvironmentSnapshots.Database.Model;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace BusinessEnvironmentSnapshots.Database.Tests
{
    [TestClass]
    public class ChartTests
    {
        //[TestMethod]
        //public void OverallDistanceToFrontierTest()
        //{
        //    var rep = new ChartRepository.Repository();
        //    var chart = rep.GetChart("OverallDistanceToFrontier", "KEN", "2010-2015");
        //    var kenSerie = chart.Series.FirstOrDefault(s => s.Name == "Kenya");
        //    Assert.IsNotNull(kenSerie);

        //    var i = 2010;
        //    var categories = chart.Xaxis.Categories;
        //    foreach (var category in categories)
        //    {
        //        Assert.AreEqual(i.ToString(), category);
        //        i++;
        //    }

        //    i = 0;
        //    var expectedValues = new [] {56.57000, 56.82000, 56.95000, 57.14000, 54.59000, 54.98000};
        //    foreach (var value in kenSerie.Values)
        //    {
        //        Assert.AreEqual((decimal)expectedValues[i++], value.Value);

        //    }
        //}

        //[TestMethod]
        //public void GlobalCompetitivenessPillarsTest()
        //{
        //    var rep = new ChartRepository.Repository();
        //    var chart = rep.GetChart("GlobalCompetitivenessPillars", "KEN", "2013");
        //    var kenSerie = chart.Series.FirstOrDefault(s => s.Name == "Kenya");
        //    Assert.IsNotNull(kenSerie);

        //    //var i = 2010;
        //    //var categories = chart.Xaxis.Categories;
        //    //foreach (var category in categories)
        //    //{
        //    //    Assert.AreEqual(i.ToString(), category);
        //    //    i++;
        //    //}

        //    var i = 0;
        //    var expectedValues = new[] { 3.62399
        //        ,3.24434
        //        ,3.64253
        //        ,4.51725
        //        ,3.53837
        //        ,4.20901
        //        ,4.62321
        //        ,4.67927
        //        ,3.36483
        //        ,3.57766
        //        ,4.09020
        //        ,3.56457 };
        //    foreach (var value in kenSerie.Values)
        //    {
        //        Assert.AreEqual((decimal)expectedValues[i++], value.Value);

        //    }
        //}
    }
}
