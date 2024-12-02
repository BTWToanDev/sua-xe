import { useEffect, useState } from "react";
import { Input, Button, LoadingScreen, ExportExcelButton } from "../../../components/ui";
import { toast } from "react-toastify";
import { formatDate } from "/DoAn2/sua-xe/src/utils/format";
import * as request from "../../../utils/request";
import * as echarts from 'echarts';

interface ServiceTypeCounts {
  Direct: number;
  Remote: number;
  Rescue: number;
}

interface StatisticData {
  date: string;
  serviceTypeCounts: ServiceTypeCounts;
  revenue: number;
  cost: number;
  taxCost: number;
}

const ThongKeDoanhThu = () => {
  const [view, setView] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fromDate, setFromDate] = useState(() => formatDate(new Date()));
  const [toDate, setToDate] = useState(() => formatDate(new Date()));
  const [statisticData, setStatisticData] = useState<StatisticData[]>([]);

  const handleSetFromDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const today = new Date();
    const date = e.target.value;

    if (new Date(date) > today) {
      toast.warn("The start date cannot be greater than the current date");
      setFromDate(formatDate(today));
      return;
    }

    setFromDate(date);
  };

  const handleSetToDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const today = new Date();
    const date = e.target.value;

    if (new Date(date) < new Date(fromDate)) {
      toast.warn("The end date cannot be smaller than the start date");
      setToDate(formatDate(today));
      return;
    }

    setToDate(date);
  };

  const handleView = () => {
    console.log("Button clicked");
    setLoading(true);
    const to = new Date(toDate);
    const tomorrow = new Date(to);
    tomorrow.setDate(to.getDate() + 1);
    const endDateFormatted = tomorrow.toISOString().split("T")[0];
    
    request
      .get(`/Statistic/revenue`, {
        params: {
          startDate: fromDate,
          endDate: endDateFormatted,
        },
      })
      .then((response) => {
        
  
          setStatisticData(response);
          setView(true);
          setTimeout(() => {
            renderChart(response);

          }, 500)
        
        setLoading(false);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy dữ liệu:", error);
        toast.error("Đã xảy ra lỗi khi lấy dữ liệu.");
        setStatisticData([]);
        setView(false);
        setLoading(false);
      });
  };
  

  const renderChart = (data: any) => {
    const chartElement = document.getElementById('chart');
    if (chartElement) {
      const myChart = echarts.init(chartElement);
      const revenue = data.revenue;
      const cost = data.cost;
      const taxCost = data.taxCost;

      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'cross', crossStyle: { color: '#999' } }
        },
        toolbox: {
          feature: {
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ['line', 'bar'] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        legend: {
          data: ['Doanh thu', 'Tiền nhập hàng', 'Tiền thuế nhập hàng']
        },
        xAxis: [
          {
            type: 'type',
            data: ['Doanh thu', 'Tiền nhập hàng', 'Tiền thuế nhập hàng'],
            axisPointer: { type: 'shadow' }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: 'Values',
            min: 0,
            axisLabel: { formatter: '{value}' }
          }
        ],
        series: [
          { name: 'Doanh thu', type: 'bar', data: revenue },
          { name: 'Tiền nhập hàng', type: 'bar', data: cost },
          { name: 'Tiền thuế nhập hàng', type: 'bar', data: taxCost }
        ]
      };

      setTimeout(() => {

        myChart.setOption(option);
      }, 2000)
    }
  };

  useEffect(() => {
    if (!fromDate) setFromDate(formatDate(new Date()));
    if (!toDate) setToDate(formatDate(new Date()));
  }, [fromDate, toDate]);

  return (
    <div>
      <div className="m-4">
        {loading && <LoadingScreen />}
        <h1 className="font-bold text-3xl text-gray-600 mb-4">Thống kê</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
          <div>
            <label className="text-green-900 text-xl float-start">From</label>
            <Input value={fromDate} onChange={handleSetFromDate} type="date" />
          </div>
          <div>
            <label className="text-green-900 text-xl float-start">To</label>
            <Input value={toDate} onChange={handleSetToDate} type="date" />
          </div>
        </div>
        <Button primary onClick={handleView}>View</Button>
      </div>
      <div id="chart" style={{ width: "100%", height: "400px" }} />
    </div>
  );
};

export default ThongKeDoanhThu;
