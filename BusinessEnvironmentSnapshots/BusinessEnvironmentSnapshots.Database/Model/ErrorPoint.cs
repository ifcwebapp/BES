﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessEnvironmentSnapshots.Database.Model
{
    public class ErrorPoint : Point
    {
        public decimal? Error { get; set; }
    }
}
