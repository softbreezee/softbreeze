Telemetry(遥测)是一个广义的概念，指的是从远程设备或系统中收集数据并传输到中央系统进行监控和分析。OTEL(OpenTelemtry)是一个具体的实现。
SNMP(Simple Network Management Protocol) 和 OTEL 同属观测领域的可测方案，前者主要用于网络设备和管理和监控，而后者主要用于分布式应用程序的观测。
SNMP
主要用于网络设备的管理和监控。适用于监控路由器、交换机、服务器等网络设备的状态和性能。
提供设备的配置管理、故障管理、性能管理和安全管理。
架构
基于客户端-服务器架构。
NMS：NMS在网络中扮演管理者角色，是一个采用SNMP协议对网络设备进行管理/监视的系统，运行在NMS服务器上。
NMS可以向设备上的Agent发出请求，查询或修改一个或多个具体的参数值。
NMS可以接收设备上的Agent主动发送的Trap信息，以获知被管理设备当前的状态。
Agent：被管理设备中的一个代理进程，用于维护被管理设备的信息数据并响应来自NMS的请求，把管理数据汇报给发送请求的NMS。可以在 agent 的 snmp.yml 文件中配置采集监控哪些指标(通过Promethues snmp_expoter 实现)。
Agent接收到NMS的请求信息后，通过MIB表完成相应指令后，并把操作结果响应给NMS。
当设备发生故障或者其它事件时，设备会通过Agent主动发送信息给NMS，向NMS报告设备当前的状态变化。
Managed Object：被管理对象。每一个设备可能包含多个被管理对象，被管理对象可以是设备中的某个硬件，也可以是在硬件、软件（如路由选择协议）上配置的参数集合。
MIB(Management Information Base)：是一个树状数据库，指明了被管理设备所维护的变量，是能够被Agent查询和设置的信息。MIB在数据库中定义了被管理设备的一系列属性：对象的名称、对象的状态、对象的访问权限和对象的数据类型等。又称为对象命名树，每个对象标识符OID（object identifier）对应于树中的一个管理对象，该树的每个分支都有一个数字和一个名称，并且每个点都以从该树的顶部到该点的完整路径命名。通过MIB，可以完成以下功能：
Agent通过查询MIB，可以获知设备当前的状态信息。
Agent通过修改MIB，可以设置设备的状态参数。
数据模型
通过 MIB+OID定义设备可以报告的变量。
数据类型包括整数、字符串、计数器等。
传输协议
通常使用 UDP 进行传输，默认端口为 161（请求）和 162（陷阱）。也可以使用 TCP，但较少见。
传输的数据格式为 ASN.1（抽象语法表示法）。
What is an SNMP community string?
In SNMP (Simple Network Management Protocol), community strings act as a form of authentication between the SNMP client and the SNMP agent.
The “SNMP community string” is like a user ID or password that allows access to the SNMP agent, for example, a router's, firewall’s, or other network device's statistics.
SNMP strings are used only by devices which support the SNMPv1 and SNMPv2c version of SNMP. SNMPv3 uses username/password authentication, along with an encryption key.
Most SNMPv1 and SNMPv2 equipment ships from the factory with a default community string set to the read-only community string “public”, instead of the “private” read-write community string. It is standard practice for network administrators to configure SNMP by changing all the community strings to customized values in the SNMP settings during device setup.
Next to the read-only (RO) and read-write (RW) community strings, there’s also the trap community string. This string is used to specify the community string that an SNMP agent will use when sending SNMP trap messages to the SNMP client. Traps are asynchronous notifications from the agent to the client about certain events or conditions.
OTEL
主要用于分布式系统的可观测性。适用于监控应用程序的性能和行为，特别是分布式系统中的服务调用链路。
提供追踪、度量和日志记录，帮助开发者和运维人员了解应用程序的运行状况。
使用于多种后端系统，可以将数据发送到不同的存储和分析平台。
架构
基于分布式追踪和度量的架构。
由多个组件组成，包括 SDK、Collector 和后端存储。
SDK 嵌入到应用程序中，收集追踪和度量数据；Collector 收集和处理数据；后端存储用于存储和分析数据。
数据模型
使用 Span、Metric 和 Log 等数据结构来表示追踪、度量和日志信息。
Span 表示分布式追踪中的一个操作单元，包含开始时间、结束时间、标签等信息。
Metric 表示度量数据，包含计数器、直方图、摘要等类型。
Log 表示日志数据，包含时间戳、消息、标签等信息。
传输协议
支持多种传输协议，包括 HTTP、gRPC 等。
传输的数据格式为 Protobuf、JSON 等。
可以配置不同的传输协议和数据格式，以适应不同的后端存储和分析系统。


Netflow 协议





Prometheus
观测后端的一种具体实现。
主要用于系统和服务的度量监控。
专注于收集和存储时间序列数据(metrics)，并提供强大的查询语句(PromQL)用于分析和报警。
通常用于监控基础设施和应用程序的性能指标。
架构

基于取拉模型的架构。
有 Prometheus 服务器、数据存储、Alertmanager 和可视化工具(Grafana)组成。
Prometheus 服务器定期从被监控的目标(targets)拉去度量数据，病存储在本地时间序列数据库中。
数据模型
时间序列数据
数据与指标的关系
所有监控采集的数据均以指标的方式保存
指标共有4种类型(Counter,Gauge,Histogram,Summary)，4 种类型都用统一的格式保存。
 agent 采集的数据格式： 指标名{k:v,...} 时间戳 值
一般在设置指标名的时候，按照命名规范命名
不同类型的指标的值不一样
样本：即采集器采集的一条数据，不同类型指标的一条数据(样本)不一定只是“一条数据”，为了计算分位值之类的指标，往往需要保存更多的信息。
传输方式
使用 HTTP协议进行数据拉取
被监控的目标需要暴露一个 HTTP端点，Prometheus 服务器定期从该端点拉取度量数据。
https://opentelemetry.io/blog/2024/prom-and-otel/
https://www.ibm.com/think/topics/opentelemetry-vs-prometheus
https://signoz.io/blog/opentelemetry-vs-prometheus/
