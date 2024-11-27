import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface User {
  firstName: string;
  profilePic: string;
}

interface PIRegisterData {
  GrpFld1: string; // Party Name
  GrpFld2: string; // PI Number
  OdrTotQty: number; // Total Quantity
  OdrTotArea: number; // Total Area
  OdrBsAmt: number; // Basic Amount
  OdrNetAmt: number; // Net Amount
}

const PIRegister: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [data, setData] = useState<PIRegisterData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters state
  const [filters, setFilters] = useState({
    odrNoFrom: 100,
    odrNoTo: 200,
  });

  // Fetch PI Register data from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://api4.rectrans.in/api/EstOrder/GetEstOdrByRefNo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            GrpFlag: 'AC',
            OdrNoFrom: 100,
            OdrNoTo: 1000,
            PiNoFrom: 0,
            PiNoTo: 0,
            SpName: '',
            AcPRefNo: 0,
          }),
        });
        const result = await response.json();
        if (Array.isArray(result)) {
          setData(result);
        } else {
          setData([]);
        }
      } catch (error) {
        console.error('Error fetching PI Register data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [filters]);

  // Render each row of the table
  const renderItem = ({ item }: { item: PIRegisterData }) => (
    <View style={styles.tableRow}>
      <Text style={[styles.tableCell, styles.columnParty]}>{item.GrpFld1}</Text>
      <Text style={[styles.tableCell, styles.columnPi]}>{item.GrpFld2}</Text>
      <Text style={[styles.tableCell, styles.columnQty]}>{item.OdrTotQty}</Text>
      <Text style={[styles.tableCell, styles.columnArea]}>{item.OdrTotArea}</Text>
      <Text style={[styles.tableCell, styles.columnBaseAmt]}>{item.OdrBsAmt.toFixed(2)}</Text>
      <Text style={[styles.tableCell, styles.columnNetAmt]}>{item.OdrNetAmt.toFixed(2)}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Top card with user information */}
      <LinearGradient
        colors={['#6a11cb', '#2575fc']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {user && <Text style={styles.userName}>Hello, {user.firstName}!</Text>}
        <Text style={styles.title}>PI Register</Text>
      </LinearGradient>

      {/* Filters */}
      <View style={styles.filterContainer}>
        <TextInput
          style={styles.filterInput}
          placeholder="Order No From"
          value={filters.odrNoFrom.toString()}
          keyboardType="numeric"
          onChangeText={(text) =>
            setFilters((prev) => ({ ...prev, odrNoFrom: parseInt(text) || 0 }))
          }
        />
        <TextInput
          style={styles.filterInput}
          placeholder="Order No To"
          value={filters.odrNoTo.toString()}
          keyboardType="numeric"
          onChangeText={(text) =>
            setFilters((prev) => ({ ...prev, odrNoTo: parseInt(text) || 0 }))
          }
        />
      </View>

      {/* Table */}
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <ScrollView horizontal>
          <View style={styles.tableContainer}>
            {/* Table header */}
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, styles.columnParty]}>Party Name</Text>
              <Text style={[styles.tableHeaderText, styles.columnPi]}>PI Number</Text>
              <Text style={[styles.tableHeaderText, styles.columnQty]}>Total Qty</Text>
              <Text style={[styles.tableHeaderText, styles.columnArea]}>Total Area</Text>
              <Text style={[styles.tableHeaderText, styles.columnBaseAmt]}>Basic Amt</Text>
              <Text style={[styles.tableHeaderText, styles.columnNetAmt]}>Net Amt</Text>
            </View>

            {/* Table body */}
            <FlatList
              data={data}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  header: {
    width: '100%',
    paddingVertical: 40,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  userName: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  filterInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginHorizontal: 5,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    margin: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
  },
  tableHeaderText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tableCell: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  columnParty: {
    width: 200,
  },
  columnPi: {
    width: 100,
  },
  columnQty: {
    width: 100,
  },
  columnArea: {
    width: 120,
  },
  columnBaseAmt: {
    width: 120,
  },
  columnNetAmt: {
    width: 120,
  },
});

export default PIRegister;
