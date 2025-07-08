import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 30 },
  header: { marginBottom: 20 },
  title: { fontSize: 24, marginBottom: 10 },
  section: { marginBottom: 10 },
  label: { fontSize: 12, color: '#666' },
  value: { fontSize: 14, marginBottom: 5 }
});

const ConfirmationPDF = ({ service, queue }) => (
  <Document>
    <Page style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Appointment Confirmation</Text>
        <Text>Immigration Services Department</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.label}>Service Type:</Text>
        <Text style={styles.value}>
          {service.serviceType.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
        </Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.label}>Applicant Name:</Text>
        <Text style={styles.value}>{service.details.fullName}</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.label}>Appointment Date:</Text>
        <Text style={styles.value}>
          {new Date(service.appointment.date).toLocaleDateString('en-US', { 
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
          })}
        </Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.label}>Time:</Text>
        <Text style={styles.value}>
          {service.appointment.timeSlot ? 
            new Date(`2000-01-01T${service.appointment.timeSlot}`).toLocaleTimeString([], { 
              hour: '2-digit', minute: '2-digit' 
            }) : ''}
        </Text>
      </View>
      
      {queue && (
        <View style={styles.section}>
          <Text style={styles.label}>Queue Number:</Text>
          <Text style={styles.value}>{queue.queueNumber}</Text>
        </View>
      )}
      
      <View style={styles.section}>
        <Text style={styles.label}>Status:</Text>
        <Text style={styles.value}>{service.status.toUpperCase()}</Text>
      </View>
      
      <View style={{ marginTop: 20 }}>
        <Text style={styles.label}>Please bring this confirmation and required documents to your appointment.</Text>
      </View>
    </Page>
  </Document>
);

export default ConfirmationPDF;