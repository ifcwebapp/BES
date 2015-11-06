using System;
using System.Collections.Generic;

namespace BusinessEnvironmentSnapshots.Database.Model
{
    public class Chart
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public string SourceTitle { get; set; }
        public string SourceLink { get; set; }
        public string Note { get; set; }
        public bool AreValuesInversed { get; set; }
        public string TableUnitLabel { get; set; }
        public string TableIndicatorColumn { get; set; }

        public Chart()
        {
        }
    }

    public class SingleChart : Chart
    {
        public List<ChartSeries> Series { get; set; }
        public Xaxis Xaxis { get; set; }
        public Yaxis Yaxis { get; set; }
    }

    public class SeriesGroup
    {
        public List<ChartSeries> Series { get; set; }
        public String ChartId { get; set; }
        public Xaxis Xaxis { get; set; }
        public Yaxis Yaxis { get; set; }
        public Double[] ReferenceLines { get; set; }
    }

    public class MultiChart : Chart
    {
        public List<SeriesGroup> SeriesGroups { get; set; }
        public List<String> Categories { get; set; }
    }

    public interface ISomeChart {
        R Resolve<R>(Func<SingleChart, R> haveSingle, Func<MultiChart, R> haveMulti);
    }

    public class SomeChart
    {
        private class SingleChartAsSome : ISomeChart
        {
            public SingleChart Single { get; set; }
            public SingleChartAsSome(SingleChart chart)
            {
                this.Single = chart;
            }
            public R Resolve<R>(Func<SingleChart, R> haveSingle, Func<MultiChart, R> haveMulti)
            {
                return haveSingle(this.Single);
            }
        }

        public static ISomeChart FromSingle(SingleChart chart)
        {
            return new SingleChartAsSome(chart);
        }

        private class MultiChartAsSome : ISomeChart
        {
            public MultiChart Multi { get; set; }
            public MultiChartAsSome(MultiChart chart)
            {
                this.Multi = chart;
            }
            public R Resolve<R>(Func<SingleChart, R> haveSingle, Func<MultiChart, R> haveMulti)
            {
                return haveMulti(this.Multi);
            }
        }

        public static ISomeChart FromMulti(MultiChart chart)
        {
            return new MultiChartAsSome(chart);
        }
    }
    
    
}